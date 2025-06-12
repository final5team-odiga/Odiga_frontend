import axios from "axios";

const BASE_URL = "/api"; // 상대 경로로 유지

// Azure AD 인증이 필요하지 않은 경로들
const ANONYMOUS_ROUTES = [
  "/auth/login/",
  "/auth/signup/",
  "/auth/check_userid/",
];

// 인증 정보 캐싱을 위한 변수들
let cachedAuthInfo = null;
let authInfoExpiry = null;
let authCheckPromise = null;

// Azure Static Web Apps 인증 정보 가져오기 (캐싱 포함)
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
        credentials: "include"    // 쿠키를 함께 전송
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
  withCredentials: true,  // axios 요청에도 쿠키 전송
  timeout: 720000,
});

// 요청 인터셉터 수정 - 경로별 인증 분리
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("Making request to:", config.url);

    // 익명 허용 경로인지 확인 (자체 로그인 시스템 API들)
    const isAnonymousRoute = ANONYMOUS_ROUTES.some((route) =>
      config.url.includes(route)
    );

    if (isAnonymousRoute) {
      console.log(
        "Anonymous route - skipping Azure AD auth check:",
        config.url
      );
      // 자체 로그인 시스템의 경우 localStorage의 토큰 사용
      const userToken = localStorage.getItem("userID");
      if (
        userToken &&
        !config.url.includes("/login/") &&
        !config.url.includes("/signup/")
      ) {
        config.headers["Authorization"] = `Bearer ${userToken}`;
      }
      return config;
    }

    // Azure AD 인증이 필요한 경로 (매거진 API 등)
    console.log("Protected route - checking Azure AD auth:", config.url);
    const authInfo = await getAuthInfo();
    console.log("Current auth info:", authInfo);

    if (authInfo && authInfo.clientPrincipal) {
      console.log(
        "User is authenticated with Azure AD:",
        authInfo.clientPrincipal.userId
      );
      // Azure Static Web Apps는 쿠키 기반 인증을 사용
    } else {
      console.log(
        "User is not authenticated with Azure AD - redirecting to login"
      );

      // 캐시 초기화
      cachedAuthInfo = null;
      authInfoExpiry = null;

      if (!window.location.pathname.includes("/.auth/")) {
        window.location.href = "/.auth/login/aad";
      }

      return Promise.reject(new Error("Not authenticated with Azure AD"));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401 || error.response?.status === 302) {
      console.log("인증 오류 감지");

      // 익명 경로에서 인증 오류가 발생하면 자체 로그인 시스템 문제
      const isAnonymousRoute = ANONYMOUS_ROUTES.some((route) =>
        error.config?.url?.includes(route)
      );

      if (isAnonymousRoute) {
        console.log("자체 로그인 시스템 인증 오류");
        // 자체 로그인 실패 시 로그인 페이지로
        localStorage.removeItem("userID");
        localStorage.removeItem("userName");
        window.location.href = "/login";
      } else {
        console.log("Azure AD 인증 오류 - Azure 로그인 페이지로 리디렉션");
        // Azure AD 인증 실패 시
        cachedAuthInfo = null;
        authInfoExpiry = null;

        if (!window.location.pathname.includes("/.auth/")) {
          window.location.href = "/.auth/login/aad";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { getAuthInfo };
