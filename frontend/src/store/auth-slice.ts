import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient, setAuthToken } from "../client/api";

interface AuthState {
    user: {
        id: string;
        email: string;
    } | null;
    token: string | null;
    status: "idle" | "loading" | "failed" | "success";
    error?: string;
    loginSuccess: boolean;
    registerSuccess: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: "idle",
    loginSuccess: false,
    registerSuccess: false,
};

interface Credentials {
    email: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    "auth/login",
    async (creds: Credentials, { rejectWithValue }) => {
        try {
            const res = await apiClient.post("/auth/login", creds);
            const { token, user } = res.data.data;
            return { token, user };
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(
                error.response.data?.message || "login failed",
            );
        }
    },
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (creds: Credentials, { rejectWithValue }) => {
        try {
            const res = await apiClient.post("/auth/register", creds);
            const { token, user } = res.data.data;
            return { token, user };
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(
                error.response?.data?.message || "Registration failed",
            );
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.status = "idle";
            state.error = undefined;
            state.loginSuccess = false;
            state.registerSuccess = false;
            setAuthToken(null);
        },
        clearError(state) {
            state.error = undefined;
        },
        clearSuccessFlags(state) {
            state.loginSuccess = false;
            state.registerSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = undefined;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.registerSuccess = true;
                setAuthToken(action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = undefined;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                if (!action.payload) return;
                state.status = "idle";
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loginSuccess = true;
                setAuthToken(action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError, clearSuccessFlags } = authSlice.actions;
export default authSlice.reducer;
