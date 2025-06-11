import axiosInstance from "./axiosInstance";

// 로그인 API
export const login = async (userID, password) => {
  const formData = new FormData();
  formData.append("userID", userID);
  formData.append("password", password);
  const res = await axiosInstance.post("/auth/login/", formData);
  return res.data;
};

// 회원가입 API
export const signup = async ({ userID, userName, password, userEmail, userCountry, userLanguage }) => {
  const formData = new FormData();
  formData.append("userID", userID);
  formData.append("userName", userName);
  formData.append("password", password);
  formData.append("userEmail", userEmail);
  formData.append("userCountry", userCountry);
  formData.append("userLanguage", userLanguage);
  const res = await axiosInstance.post("/auth/signup/", formData);
  return res.data;
};

export const checkUserId = async (userID) => {
  const res = await axiosInstance.get(`/auth/check_userid/`, {
    params: { userID }
  });
  return res.data;
}; 