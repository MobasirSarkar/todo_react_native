import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth-routes";
import taskRoutes from "./routes/task-routes";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const v1Routes: string = "/api/v1";

app.use(cors());
app.use(express.json());

app.get(`${v1Routes}/health`, HealthChecker);

app.use(`${v1Routes}/auth`, authRoutes);
app.use(`${v1Routes}/tasks`, taskRoutes);

export default app;

function HealthChecker(_req: Request, res: Response) {
    const now = new Date().toString();
    res.json({
        status: "Ok",
        timeStamp: now,
    });
}
