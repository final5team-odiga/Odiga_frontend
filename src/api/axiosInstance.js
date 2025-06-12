import axios from "axios";

const BASE_URL = "/api";

// 인증 정보 캐싱을 위한 변수들
let cachedAuthInfo = null;
let authInfoExpiry = null;
let authCheckPromise = null;

// Azure Static Web Apps 인증 정보 가져오기 (캐싱 포함)
const getAuthInfo = async () => {
  // 이미 진행 중인 요청이 있으면 그것을 기다림
  if (authCheckPromise) {
    return authCheckPromise;
  }

  // 캐시된 정보가 유효하면 반환
  if (cachedAuthInfo && authInfoExpiry && Date.now() < authInfoExpiry) {
    return cachedAuthInfo;
  }

  // 새로운 인증 정보 요청
  authCheckPromise = (async () => {
    try {
      console.log("Fetching auth info from /.auth/me"); // 디버깅용
      const response = await fetch("/.auth/me");
      const authInfo = await response.json();

      // 캐싱 (5분간 유효)
      cachedAuthInfo = authInfo;
      authInfoExpiry = Date.now() + 5 * 60 * 1000;

      console.log("Auth info cached:", authInfo); // 디버깅용
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
  withCredentials: true,
  timeout: 720000,
});

// 요청 인터셉터 수정
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("Making request to:", config.url); // 디버깅용

    // Azure Static Web Apps 인증 확인
    const authInfo = await getAuthInfo();
    console.log("Current auth info:", authInfo); // 디버깅용

    if (authInfo && authInfo.clientPrincipal) {
      console.log("User is authenticated:", authInfo.clientPrincipal.userId);
      // Azure Static Web Apps는 쿠키 기반 인증을 사용하므로
      // withCredentials: true가 설정되어 있으면 별도 헤더 불필요
    } else {
      console.log("User is not authenticated - redirecting to login");
      // 캐시 초기화
      cachedAuthInfo = null;
      authInfoExpiry = null;

      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (!window.location.pathname.includes("/.auth/")) {
        window.location.href = "/.auth/login/aad";
      }

      return Promise.reject(new Error("Not authenticated"));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 개선
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error); // 디버깅용

    if (error.response?.status === 401 || error.response?.status === 302) {
      console.log("인증 오류 감지 - 캐시 초기화 및 로그인 페이지로 리디렉션");

      // 캐시 초기화
      cachedAuthInfo = null;
      authInfoExpiry = null;

      // localStorage 정리
      localStorage.removeItem("userID");
      localStorage.removeItem("userName");

      // 리다이렉트 (무한 루프 방지)
      if (!window.location.pathname.includes("/.auth/")) {
        window.location.href = "/.auth/login/aad";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { getAuthInfo };
