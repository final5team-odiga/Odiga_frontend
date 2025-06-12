import axios from "axios";

const BASE_URL = "https://odigawepapp.azurewebsites.net/api"; // Azure 배포용

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 720000, // 12분 (720,000ms)
  withCredentials: true  // 세션 쿠키 전송을 위해 필요
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
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
