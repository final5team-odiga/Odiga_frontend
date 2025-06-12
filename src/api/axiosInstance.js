import axios from "axios";

const BASE_URL = "/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 720000,
});

// 요청 인터셉터
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

// 응답 인터셉터 추가 (401 오류 자동 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 오류 감지 - 로그인 페이지로 리디렉션");
      localStorage.removeItem("userID");
      localStorage.removeItem("userName");
      window.location.href = "/.auth/login/aad";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
