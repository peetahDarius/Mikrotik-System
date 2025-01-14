import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './apiConstants';
import { getConfig } from "./config";

const apiFiles = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
    // baseURL: getConfig("REACT_APP_BACKEND_URL")
});

// Request Interceptor
apiFiles.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor to refresh token on 401 error
apiFiles.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            // Redirect to login or handle logout
            window.location.href = "/login";
            return Promise.reject(error);
        }

        try {
            // Try refreshing the access token
            const response = await apiFiles.post("/api/token/refresh/", { refresh: refreshToken });
            const newAccessToken = response.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);

            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Content-Type"] = "multipart/form-data";
            return apiFiles(originalRequest);
        } catch (refreshError) {
            console.error(refreshError);
            // If token refresh fails, clear local storage and redirect to login
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default apiFiles;
