import { CookieOptions, Response } from "express"
import { fiveMinutesFromNow, thirtyDaysFromNow } from "./date";

export const REFRESH_PATH = "/auth/refresh";
const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fiveMinutesFromNow()
});

export const getRefreshTokenCookieOptions = (isManager: boolean): CookieOptions => ({
    ...defaults,
    expires: isManager ? thirtyDaysFromNow() : fiveMinutesFromNow(),
    path: REFRESH_PATH
});

type Params = {
    res: Response;
    accessToken: string;
    refreshToken: string;
    isManager: boolean;
}
export const setAuthCookies = ({res, accessToken, refreshToken, isManager }: Params) =>
    res
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions(isManager)); 

export const clearAuthCookies = (res: Response) =>
    res.clearCookie("accessToken").clearCookie("refreshToken", {
        path: REFRESH_PATH
    });