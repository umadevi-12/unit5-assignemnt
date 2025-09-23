import axios from "axios";

// Adjust the baseURL if your backend runs on a different port or domain
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Optional: attach token automatically for all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
