import "dotenv/config";
import express from "express";
import cors from "cors";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import connectToDatabase from "./config/db";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import logger from "./config/logger";
import customerRoutes from "./routes/customer.route";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const app = express();

logger.info("Starting Express server...");

// Middleware to log each incoming request
app.use((req, res, next) => {
    logger.info("Incoming request", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        headers: req.headers["user-agent"]
    });
    next();
});

// Rate limiting middleware
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        logger.warn(`IP ${req.ip} has been rate-limited.`);
        res.status(options.statusCode).json({
            error: "Too many requests from this IP. Please try again later.",
        });
    },
});
app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true
    })
);
app.use(cookieParser());

app.get("/",async (req, res, next) => {
    logger.info("Health check endpoint hit");
    res.status(OK).json({
        status: "healthy"
    });
});

// auth routes
app.use("/auth", authRoutes);

// protected routes
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);
app.use("/customers", authenticate, customerRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
    try {
        await connectToDatabase();
        logger.info(`Connected to database successfully`);
    } catch (error: any) {
        logger.error("Failed to connect to database", { error: error.message });
        process.exit(1);
    }

    logger.info(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
});