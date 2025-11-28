import mongoose, { Document, Schema, Types } from "mongoose";
import { USER_DOCUMENT_NAME } from "./user";

export const TASK_DOCUMENT_NAME: string = "Task";
export const TASK_COLLECTION_NAME: string = "tasks";

export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
    _id: Types.ObjectId;
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    dateTime: Date;
    deadLine: Date;
    priority: TaskPriority;
    completed: boolean;
}

const taskSchema = new Schema<ITask>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: USER_DOCUMENT_NAME,
            required: true,
        },
        title: {
            type: Schema.Types.String,
            required: true,
        },
        description: {
            type: Schema.Types.String,
        },
        dateTime: {
            type: Schema.Types.Date,
            required: true,
        },

        deadLine: {
            type: Schema.Types.Date,
            required: true,
        },
        priority: {
            type: Schema.Types.String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        completed: {
            type: Schema.Types.Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

taskSchema.index({ _id: 1, user: 1 });

export const Task = mongoose.model<ITask>(
    TASK_DOCUMENT_NAME,
    taskSchema,
    TASK_COLLECTION_NAME,
);
