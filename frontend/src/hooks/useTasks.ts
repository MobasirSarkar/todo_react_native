import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client/api";

export const useTasks = () => {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const { data } = await apiClient.get("/tasks");
            return data;
        },
        retry: 1, // don't spam failures
        refetchOnWindowFocus: false, // RN recommended
    });
};
