import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { RES_JSON } from "../common/req-json";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json(RES_JSON("No Bearer Token found", false, 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        logger.error(`[MIDDLEWARE] error: ${error}`);
        return res.status(401).json(RES_JSON("invalid token", false, 401));
    }
};
