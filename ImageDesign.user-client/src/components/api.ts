import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5083/api",
});

// הוספת Interceptor לכל בקשה
api.interceptors.request.use(
  (config) => {
    const userData = sessionStorage.getItem("user"); // טען מה-sessionStorage
    const user = userData ? JSON.parse(userData) : null;
    const token = user ? user.token: null;
    console.log("token",token);
     
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;