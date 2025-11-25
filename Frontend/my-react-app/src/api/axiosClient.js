// src/api/axiosClient.js
import axios from "axios";

const baseURL = "http://localhost:5000/api";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: global response handler for auth errors
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      // For debugging in dev you can console.log the server message
      console.error("API error", err.response.status, err.response.data);
    }
    return Promise.reject(err);
  }
);

export default instance;
