import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RES_JSON } from "../common/req-json";
import { User } from "../models/user";
import { logger } from "../utils/logger";

export const createToken = (userId: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");

    // for some reason the jwt is not working when i am using process.env.JWT_EXPIRES_IN ,
    // so have to hardcode the exp time
    return jwt.sign({ userId }, secret, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(RES_JSON("credentials required", false, 400));
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .json(
                    RES_JSON(
                        "user with this email already registered",
                        false,
                        409,
                    ),
                );
        }
        const user = await User.create({ email, password });
        const userId = user._id.toString();
        const token = createToken(userId);

        const { password: _, ...safeUser } = user;
        const data = {
            token: token,
            user: safeUser,
        };

        return res
            .status(201)
            .json(RES_JSON("user registered successfully", true, 201, data));
    } catch (error) {
        logger.error(`[AUTH] error: ${error}`);
        return res.status(500).json(RES_JSON("registered failed", false, 500));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json(RES_JSON("invalid credentials", false, 401));
        }
        const valid = await user.ComparePassword(password);
        if (!valid) {
            return res
                .status(401)
                .json(RES_JSON("invalid credentials", false, 401));
        }
        const userId = user._id.toString();
        const token = createToken(userId);

        const { password: _, ...safeUser } = user;

        const data = {
            token: token,
            user: safeUser,
        };

        return res
            .status(200)
            .json(RES_JSON("login successfully", true, 200, data));
    } catch (error) {
        logger.error(`[AUTH] error: ${error}`);
        return res.status(500).json(RES_JSON("login failed", false, 500));
    }
};
