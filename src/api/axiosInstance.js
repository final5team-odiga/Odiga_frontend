import axios from "axios";
import BASE_URL from "../config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 필요시
  timeout: 720000, // 12분 (720,000ms)
});

export default axiosInstance; 