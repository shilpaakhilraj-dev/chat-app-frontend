import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// REGISTER
export const registerUser = async (name, email, password) => {
  try {
    const res = await API.post("/api/auth/register", { name, email, password });
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.detail || "Registration failed",
    };
  }
};

// LOGIN
export const loginUser = async (email, password) => {
  try {
    const res = await API.post("/api/auth/login", { email, password });
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.detail || "Login failed",
    };
  }
};

// GET CURRENT USER
export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`/api/auth/me?token=${token}`);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.detail || "Failed to fetch user",
    };
  }
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};