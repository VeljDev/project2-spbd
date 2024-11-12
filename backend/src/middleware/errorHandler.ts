import { ErrorRequestHandler, Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";
import logger from "../config/logger";


const handleZodError = (res: Response, error: z.ZodError, req: Request) => {
    // Join all messages from Zod issues into a single string
    const errorMessage = error.issues.map((err) => err.message).join(" | ");

    // Log Zod validation errors
    logger.warn("Zod validation error", {
        path: req.path,
        errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        })),
    });
    
    res.status(BAD_REQUEST).json({
        message: errorMessage,
    });
};

const handleAppError = (res: Response, error: AppError, req: Request) => {
    // Log custom application errors
    logger.warn("Application error", {
        path: req.path,
        message: error.message,
        errorCode: error.errorCode,
    });

    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    // Log every error with full details
    logger.error("Error occurred", {
        path: req.path,
        method: req.method,
        error: {
            message: error.message,
            stack: error.stack,
        },
    });

    if(req.path === REFRESH_PATH) {
        clearAuthCookies(res);
    }

    if(error instanceof z.ZodError) {
        return handleZodError(res, error, req);
    }

    if(error instanceof AppError) {
        return handleAppError(res, error, req);
    }

    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;