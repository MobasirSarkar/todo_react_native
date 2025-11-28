import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Task } from "../models/task";
import { computeTaskScore } from "../utils/taskPriority";
import { RES_JSON } from "../common/req-json";
import { logger } from "../utils/logger";

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        if (tasks.length === 0) {
            return res
                .status(200)
                .json(RES_JSON("no tasks found", true, 200, []));
        }

        const withScore = tasks.map((t) => ({
            task: t,
            score: computeTaskScore(t),
        }));

        withScore.sort((a, b) => b.score - a.score);

        const data = withScore.map((s) => s.task);

        return res.status(200).json(RES_JSON("tasks fetched", true, 200, data));
    } catch (error) {
        logger.error(`[TASK] error: ${error}`);
        return res
            .status(500)
            .json(RES_JSON("failed to fetch tasks ", false, 500));
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, dateTime, deadline, priority } = req.body;
        if (!title || !dateTime || !deadline) {
            return res
                .status(400)
                .json(
                    RES_JSON(
                        "title, datetime and deadline are required",
                        false,
                        400,
                    ),
                );
        }

        const task = await Task.create({
            user: req.userId,
            title,
            description,
            dateTime,
            deadLine: deadline,
            priority,
        });

        res.status(201).json(RES_JSON("task created", true, 201, task));
    } catch (error) {
        logger.error(`[TASK] error: ${error}`);
        return res
            .status(500)
            .json(RES_JSON("failed to create task", true, 500));
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.body || Object.keys(req.body).length === 0) {
            return res
                .status(400)
                .json(RES_JSON("request body cannot be empty", false, 400));
        }

        // 2) allowed fields only
        const allowedFields = [
            "title",
            "description",
            "dateTime",
            "deadLine",
            "priority",
            "completed",
        ];

        const invalidFields = Object.keys(req.body).filter(
            (key) => !allowedFields.includes(key),
        );

        if (invalidFields.length > 0) {
            return res
                .status(400)
                .json(
                    RES_JSON(
                        `invalid fields: ${invalidFields.join(", ")}`,
                        false,
                        400,
                    ),
                );
        }
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.userId },
            req.body,
            { new: true },
        );

        if (!task)
            return res.status(404).json(RES_JSON("task not found", false, 404));
        return res.status(200).json(RES_JSON("task updated", true, 200));
    } catch (error) {
        logger.error(`[TASK] error: ${error}`);
        return res
            .status(500)
            .json(RES_JSON("failed to update task", false, 500));
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
        if (!task)
            return res.status(404).json(RES_JSON("task not found", false, 404));

        return res.status(200).json(RES_JSON("Task deleted", true, 200));
    } catch (error) {
        logger.error(`[TASK] error: ${error}`);
        return res
            .status(500)
            .json(RES_JSON("failed to delete task", false, 500));
    }
};
