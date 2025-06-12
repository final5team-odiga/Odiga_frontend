import axios from "axios";
import BASE_URL from "../config";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://odigawepapp.azurewebsites.net/api" // Azure Web App + /api 경로
    : "http://localhost:8000/api"; // 로컬 개발용

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 필요시
  timeout: 720000, // 12분 (720,000ms)
});

export default axiosInstance;
