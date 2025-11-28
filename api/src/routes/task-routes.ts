import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/task-controller";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
