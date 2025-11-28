import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI as string;
        if (!uri) throw new Error("MONGO_URI not set");
        await mongoose.connect(uri);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error(`MongoDB connection error: ${error}`);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.connection.close();
};
