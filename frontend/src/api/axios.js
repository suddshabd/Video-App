import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "/api/v1"          // same origin in production
        : "http://localhost:8000/api/v1",
    withCredentials: true,
});
