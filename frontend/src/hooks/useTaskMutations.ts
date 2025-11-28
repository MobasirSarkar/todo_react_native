import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client/api";

export const useTaskMutations = () => {
    const qc = useQueryClient();

    const createTask = useMutation({
        mutationFn: (data: any) =>
            apiClient.post("/tasks", data).then((res) => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const updateTask = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            apiClient.patch(`/tasks/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const deleteTask = useMutation({
        mutationFn: (id: string) =>
            apiClient.delete(`/tasks/${id}`).then(() => id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    return { createTask, updateTask, deleteTask };
};
