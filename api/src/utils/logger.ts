import pino, { LoggerOptions } from "pino";

const isProd = process.env.NODE_ENV === "production";

const options: LoggerOptions = {
    level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
    transport: isProd
        ? undefined
        : {
            target: "pino-pretty",
            options: {
                colorize: true,
                tanslateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        },
};

export const logger = pino(options);
