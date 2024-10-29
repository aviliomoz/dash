import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_URL : "http://localhost:3000/api",
    withCredentials: true
})