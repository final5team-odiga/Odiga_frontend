import axios from "axios";

const BASE_URL = "https://odigawepapp.azurewebsites.net/api"; // 상대 경로로 유지

// 자체 로그인 시스템 경로들 (토큰이 필요한 경우)
const SELF_AUTH_ROUTES = [
  "/auth/login/",
  "/auth/signup/",
  "/auth/check_userid/",
];

// 인증 정보 캐싱을 위한 변수들 (선택적 사용)
let cachedAuthInfo = null;
let authInfoExpiry = null;
let authCheckPromise = null;

// Azure Static Web Apps 인증 정보 가져오기 (선택적 기능으로 유지)
const getAuthInfo = async () => {
  if (authCheckPromise) {
    return authCheckPromise;
  }

  if (cachedAuthInfo && authInfoExpiry && Date.now() < authInfoExpiry) {
    return cachedAuthInfo;
  }

  authCheckPromise = (async () => {
    try {
      console.log("Fetching auth info from /.auth/me");
      const response = await fetch("/.auth/me", {
        credentials: "include", // 쿠키를 함께 전송
      });
      const authInfo = await response.json();

      // 캐싱 (5분간 유효)
      cachedAuthInfo = authInfo;
      authInfoExpiry = Date.now() + 5 * 60 * 1000;

      console.log("Auth info cached:", authInfo);
      return authInfo;
    } catch (error) {
      console.error("Auth info fetch failed:", error);
      cachedAuthInfo = null;
      authInfoExpiry = null;
      return null;
    } finally {
      authCheckPromise = null;
    }
  })();

  return authCheckPromise;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // axios 요청에도 쿠키 전송
  timeout: 720000,
});

// 요청 인터셉터 수정 - 단순화된 인증 처리
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("Making request to:", config.url);

    // 자체 로그인 시스템에서 토큰이 필요한 경우에만 헤더 추가
    const isSelfAuthRoute = SELF_AUTH_ROUTES.some((route) =>
      config.url.includes(route)
    );

    if (isSelfAuthRoute) {
      console.log("Self auth route - adding token if available:", config.url);
      const userToken = localStorage.getItem("userID");
      if (
        userToken &&
        !config.url.includes("/login/") &&
        !config.url.includes("/signup/") &&
        !config.url.includes("/check_userid/")
      ) {
        config.headers["Authorization"] = `Bearer ${userToken}`;
      }
    } else {
      console.log("Anonymous route - no authentication required:", config.url);
      // 모든 다른 API는 anonymous 접근이므로 인증 체크 불필요

      // 선택적으로 Azure AD 정보 로깅 (디버깅용)
      try {
        const authInfo = await getAuthInfo();
        if (authInfo && authInfo.clientPrincipal) {
          console.log(
            "Azure AD user detected:",
            authInfo.clientPrincipal.userId
          );
          // 필요시 사용자 식별용으로 활용 가능
        }
      } catch (error) {
        // Azure AD 인증 실패해도 API 호출은 계속 진행
        console.log(
          "Azure AD auth optional - continuing with anonymous access"
        );
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 수정 - 단순화된 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401 || error.response?.status === 302) {
      console.log("인증 오류 감지");

      // 자체 로그인 시스템 관련 에러만 처리
      const isSelfAuthRoute = SELF_AUTH_ROUTES.some((route) =>
        error.config?.url?.includes(route)
      );

      if (isSelfAuthRoute) {
        console.log("자체 로그인 시스템 인증 오류");
        localStorage.removeItem("userID");
        localStorage.removeItem("userName");
        window.location.href = "/login";
      } else {
        // 다른 API들은 anonymous 접근이므로 401/302 에러가 발생하면 로깅만
        console.log(
          "Unexpected auth error on anonymous route - API might need debugging"
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { getAuthInfo };
