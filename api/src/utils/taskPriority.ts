import { ITask } from "../models/task";

export const computeTaskScore = (task: ITask): number => {
    const now = Date.now();
    const deadLineTime = new Date(task.deadLine).getTime();

    const timeDiffhr = (deadLineTime - now) / (1000 * 60 * 60);

    let timeScore: number;
    if (timeDiffhr <= 0) {
        timeScore = 100;
    } else if (timeDiffhr < 24) {
        timeScore = 80;
    } else if (timeDiffhr < 72) {
        timeScore = 50;
    } else {
        timeScore = 20;
    }

    let priorityScore = 0;
    switch (task.priority) {
        case "high":
            priorityScore = 50;
        case "medium":
            priorityScore = 30;
        case "low":
            priorityScore = 10;
            break;
    }

    const createdAt = (task as any).createdAt
        ? new Date((task as any).createdAt).getTime()
        : now;
    const ageHrs = (now - createdAt) / (1000 * 60 * 60);
    const ageScrs = Math.min(ageHrs / 24, 10);

    return timeScore + priorityScore + ageScrs;
};
