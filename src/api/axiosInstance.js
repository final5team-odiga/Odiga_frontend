import axios from "axios";

const BASE_URL = "/api"; // 상대 경로로 변경

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 720000,
});

// 요청 인터셉터는 동일하게 유지
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userID");
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
