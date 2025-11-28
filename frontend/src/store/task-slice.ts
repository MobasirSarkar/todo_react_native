import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../api/client";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    _id: string;
    title: string;
    description?: string;
    dateTime: string;
    deadLine: string;
    priority: TaskPriority;
    completed: boolean;
}

interface TaskState {
    items: Task[];
    status: "idle" | "loading" | "failed";
    error?: string;
}

const initialState: TaskState = {
    items: [],
    status: "idle",
};

export const fetchTasks = createAsyncThunk(
    "tasks/create",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient.get("/tasks");
            return res.data as Task[];
        } catch (error) {
            return rejectWithValue("Failed to fetch tasks");
        }
    },
);

export const createTask = createAsyncThunk(
    "tasks/create",
    async (payload: Omit<Task, "_id" | "completed">, { rejectWithValue }) => {
        try {
            const res = await apiClient.post("/tasks", payload);
            return res.data as Task;
        } catch (error) {
            return rejectWithValue("failed to create task");
        }
    },
);

export const updateTask = createAsyncThunk(
    "tasks/update",
    async (
        { id, data }: { id: string; data: Partial<Task> },
        { rejectWithValue },
    ) => {
        try {
            const res = await apiClient.patch(`/tasks/${id}`, data);
            return res.data as Task;
        } catch (error: any) {
            return rejectWithValue("Failed to update task");
        }
    },
);

export const deleteTask = createAsyncThunk(
    "tasks/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/tasks/${id}`);
            return id;
        } catch (error) {
            rejectWithValue("Failed to delete task");
        }
    },
);

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "idle";
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const idx = state.items.findIndex(
                    (t) => t._id === action.payload._id,
                );
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (t) => t._id !== action.payload,
                );
            });
    },
});

export default taskSlice.reducer;
