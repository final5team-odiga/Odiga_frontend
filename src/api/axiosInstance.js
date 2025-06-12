import axios from "axios";

const BASE_URL = "https://odigawepapp.azurewebsites.net/api";

// ⭐️ 자체 로그인 토큰이 필요한 API 경로 목록을 확장합니다.
const TOKEN_REQUIRED_ROUTES = [
  "/articles",
  "/profile",
  "/magazine",
  "/storage",
  "/speech",
];

// Azure Static Web Apps 인증 정보 가져오기 (선택적 기능으로 유지)
const getAuthInfo = async () => {
  // ... (이 함수는 수정할 필요 없음)
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 720000,
});

// 요청 인터셉터 수정 - 토큰 추가 로직 개선
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("Making request to:", config.url);

    // ⭐️ 요청 URL이 토큰 필요 목록에 포함되는지 확인합니다.
    const requiresToken = TOKEN_REQUIRED_ROUTES.some((route) =>
      config.url.startsWith(route)
    );

    if (requiresToken) {
      console.log(
        "Token required route, adding Authorization header:",
        config.url
      );
      const userToken = localStorage.getItem("userID");
      if (userToken) {
        config.headers["Authorization"] = `Bearer ${userToken}`;
        console.log("Token added to header.");
      } else {
        console.warn("Token required but not found in localStorage.");
        // 토큰이 없으면 요청을 취소하거나 에러 처리 가능
        // return Promise.reject(new Error("Authentication token is missing."));
      }
    } else {
      console.log("Public route, no token added:", config.url);
    }

    // ... (필요시 Azure AD 관련 로직 추가 가능)

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터는 기존 로직을 유지하거나 필요에 따라 수정
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      console.error("401 Unauthorized - Token might be invalid or expired.");
      // 예를 들어, 자동으로 로그아웃 처리
      // localStorage.removeItem("userID");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { getAuthInfo };
