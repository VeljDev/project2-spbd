import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";
import logger from "./logger";


const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info("Connected to MongoDB database"); // Log successful connection
    } catch (error) {
        logger.error("Could not connect to database", {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        process.exit(1);
    }
};

export default connectToDatabase;