import axios from "axios";
import BASE_URL from "../config";

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