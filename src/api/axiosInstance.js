import axios from "axios";

const BASE_URL = "https://odigawepapp.azurewebsites.net/api"; // Static Web Apps 프록시 사용

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 필요시
  timeout: 720000, // 12분 (720,000ms)
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

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
