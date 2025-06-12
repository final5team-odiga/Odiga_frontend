import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://odigawepapp.azurewebsites.net/api" // Azure Web App + /api 경로
    : "http://localhost:8000/api"; // 로컬 개발용

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 필요시
  timeout: 720000, // 12분 (720,000ms)
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userID');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
