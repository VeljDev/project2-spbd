import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationCodeSchema } from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.models";
import appAssert from "../utils/appAssert";
import logger from "../config/logger";



export const registerHandler = catchErrors(async (req, res) => {
    logger.info("Registration attempt", { path: req.path });

    // validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    });

    // call service
    const { employee, accessToken, refreshToken } = await createAccount(request);

    logger.info("Registration successful");

    // return response
    return setAuthCookies({res, accessToken, refreshToken, isManager: employee.IsManager}) 
    .status(CREATED)
    .json(employee);
});

export const loginHandler = catchErrors(async (req, res) => {
    logger.info("Login attempt", { path: req.path });

    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    });

    const { accessToken, refreshToken, employee } = await loginUser(request);

    logger.info("Login successful");

    return setAuthCookies({res, accessToken, refreshToken, isManager: employee.IsManager }).status(OK).json({
        message: "Login successful"
    });
});

export const logoutHandler = catchErrors(async (req, res) => {
    logger.info("Logout attempt", { path: req.path });

    const accessToken = req.cookies.accessToken as string|undefined;
    const { payload } = verifyToken(accessToken || "");

    if(payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    logger.info("Logout successful");

    return clearAuthCookies(res).status(OK).json({
        message: "Logout successful"
    });
});

export const refreshHandler = catchErrors(async (req, res) => {
    logger.info("Access token refresh attempt", { path: req.path });

    const refreshToken = req.cookies.refreshToken as string|undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    const { accessToken } = await refreshUserAccessToken(
        refreshToken
    );

    logger.info("Access token refreshed");

    return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
        message: "Access token refreshed"
    });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
    logger.info("Email verification attempt", { path: req.path });

    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(verificationCode);

    logger.info("Email verified successfully");

    return res.status(OK).json({
        message: "Email was successfully verified"
    });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
    const email = emailSchema.parse(req.body.email);

    logger.info("Password reset request", { path: req.path });

    await sendPasswordResetEmail(email);

    logger.info("Password reset email sent");

    return res.status(OK).json({
        message: "Password reset email sent"
    });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
    logger.info("Password reset attempt", { path: req.path });

    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);

    logger.info("Password reset successful");

    return clearAuthCookies(res).status(OK).json({
        message: "Password reset successful"
    });
});