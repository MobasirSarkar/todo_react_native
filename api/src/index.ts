import http from "http";
import { connectDB, disconnectDB } from "./config/db";
import app from "./app";
import { logger } from "./utils/logger";

const port: number = Number.parseInt(process.env.PORT || "4000");

let server: http.Server;

async function start() {
    try {
        await connectDB();
        server = app.listen(port, () => {
            logger.info(`[SERVER] running on port ${port}`);
        });
    } catch (error) {
        logger.error(` [SERVER] failed to start : ${error}`);
        process.exit(1);
    }
}

start();

async function shutdown(signal: string) {
    logger.info(`\n${signal} received. Cleaning up...`);

    try {
        await new Promise<void>((resolve) => {
            server.close(() => {
                logger.info(`[SERVER] closed`);
                resolve();
            });
        });
        await disconnectDB();
        logger.info(`Database connection closed`);
        process.exit(0);
    } catch (error) {
        logger.error(`[SERVER] failed to shutdown: ${error}`);
        process.exit(1);
    }
}

["SIGINT", "SIGTERM"].forEach((sig) => {
    process.on(sig, () => shutdown(sig));
});
