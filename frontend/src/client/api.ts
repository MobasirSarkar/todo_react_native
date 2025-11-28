import axios from "axios";
const API_BASE_URL = "http://192.168.1.102:5000/api/v1";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

export const setAuthToken = (token?: string | null) => {
    if (token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common.Authorization;
    }
};
