import axios from "axios";

const BASE_URL = "https://odigawepapp.azurewebsites.net/api"; // Static Web Apps 프록시 사용

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials 제거 (프록시 사용 시 불필요)
  timeout: 720000,
});

// 요청 인터셉터 추가
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
