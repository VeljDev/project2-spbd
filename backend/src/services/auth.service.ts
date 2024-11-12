import VerificationCodeType from "../constants/verificationCodeTypes";
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import EmployeeModel from "../models/employee.model";
import VerificationCodeModel from "../models/verificationCode.model";
import SessionModel from "../models/session.models";
import appAssert from "../utils/appAssert";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/http";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates";
import { APP_ORIGIN } from "../constants/env";
import { hashValue } from "../utils/bcrypt";

type CreateAccountParams = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userAgent?: string;
};
export const createAccount = async (data: CreateAccountParams) => {
    // verify existing user doesn't exist
    const existingEmployee = await EmployeeModel.exists({
        Email: data.email
    });
    
    appAssert(!existingEmployee, CONFLICT, "Email already in use");

    // create user
    const employee = await EmployeeModel.create({
        Email: data.email,
        Password: data.password,
        FirstName: data.firstName,
        LastName: data.lastName
    });
    const employeeId = employee._id;
    
    // create verification code
    const verificationCode = await VerificationCodeModel.create({
        employeeId,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    });


    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
    // send verification email
    const { error } = await sendMail({
        to: employee.Email,
        ...getVerifyEmailTemplate(url)
    });

    if(error) {
        console.log(error);
    }

    // create session
    const session = await SessionModel.create({
        employeeId,
        userAgent: data.userAgent
    });

    // sign access token & refresh token
    const refreshToken = signToken(
        { sessionId: session._id },
        refreshTokenSignOptions
    );

    const accessToken = signToken({ 
        employeeId,
        sessionId: session._id
    });

    //return user & tokens
    return {
        employee: employee.omitPassword(), 
        accessToken, 
        refreshToken
    };
};

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};
export const loginUser = async ({email, password, userAgent}: LoginParams) => {
    // get the user by email
    const employee = await EmployeeModel.findOne({ Email: email });
    appAssert(employee, UNAUTHORIZED, "Invalid email or password");

    // validate the password from the request
    const isValid = await employee.comparePassword(password);
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

    const employeeId = employee._id;
    // create a session
    const session = await SessionModel.create({
       employeeId,
       userAgent 
    });

    const sessionInfo = {
        sessionId: session._id
    };

    // sign access & refresh tokens
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

    const accessToken = signToken({ 
        ...sessionInfo,
        employeeId: employeeId
    });
    
    // return user & tokens
    return {
        employee: employee.omitPassword(),
        accessToken,
        refreshToken
    };
}

export const refreshUserAccessToken = async (refreshToken: string) => {
    const {
        payload
    } = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret: refreshTokenSignOptions.secret
    });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();
    appAssert(
        session && session.expiresAt.getTime() > now,
        UNAUTHORIZED,
        "Session expired"
    );

    // refresh the session if it expires in th next 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if(sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh 
    ? signToken(
        {
        sessionId: session._id
        },
        refreshTokenSignOptions)
    : undefined;

    const accessToken = signToken({
        employeeId: session.employeeId,
        sessionId: session._id
    });

    return {
        accessToken,
        newRefreshToken
    };
};

export const verifyEmail = async (code: string) => {
    // get verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeType.EmailVerification,
        expiresAt: { $gt: new Date() }
    });
    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    // update user to verified true
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
        validCode.employeeId, 
        { Verified: true },
        { new: true }
    )
    appAssert(updatedEmployee, INTERNAL_SERVER_ERROR, "Failed to verify email");

    // delete verification code
    await validCode.deleteOne();

    // return user
    return {
        employee: updatedEmployee.omitPassword()
    };
};

export const sendPasswordResetEmail = async (email: string) => {
    try {
        // get the user by email
        const employee = await EmployeeModel.findOne({ Email: email });
        appAssert(employee, NOT_FOUND, "Employee not found");

        // check email rate limit
        const fiveMinAgo = fiveMinutesAgo();
        const count = await VerificationCodeModel.countDocuments({
            employeeId: employee._id,
            type: VerificationCodeType.PasswordReset,
            createdAt: { $gt: fiveMinAgo }
        });

        appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many requests, please try again later");

        // create verification code
        const expiresAt = oneHourFromNow();
        const verificationCode = await VerificationCodeModel.create({
            employeeId: employee._id,
            type: VerificationCodeType.PasswordReset,
            expiresAt
        });

        // send verification email
        const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;

        const { data, error } = await sendMail({
            to: employee.Email,
            ...getPasswordResetTemplate(url)
        });
        appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);

        // return success
        return {
            url,
            emailId: data.id
        };
    } catch (error: any) {
        console.log("SendPasswordResetError:", error.message);
        return {};
    }
};

type ResetPasswordParams = {
    password: string;
    verificationCode: string;
};

export const resetPassword = async (
    { password, verificationCode }: ResetPasswordParams
) => {
    // get the verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: verificationCode,
        type: VerificationCodeType.PasswordReset,
        expiresAt: { $gt: new Date() }
    });
    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    // update the users password
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
        validCode.employeeId,
        {
            Password: await hashValue(password)
        } 
    );
    appAssert(updatedEmployee, INTERNAL_SERVER_ERROR, "Failed to reset password");

    // delete the verification code
    await validCode.deleteOne();

    // delete all sessions
    await SessionModel.deleteMany({
        employeeId: updatedEmployee._id
    });

    return {
        employee: updatedEmployee.omitPassword()
    };
}