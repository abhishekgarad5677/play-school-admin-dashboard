import axios from "axios";
import { store } from "../store/store";

const API = axios.create({
    baseURL: "https://api-playschool.tmkocplayschool.com/api/", // Replace with your API URL
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

// Attach token automatically
API.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
