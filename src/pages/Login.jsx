import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axiosInstance from "../api/axiosInstance";

export default function Login() {
  const [input1, onChangeInput1] = useState('');
  const [input2, onChangeInput2] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('userID', input1);
      formData.append('password', input2);

      const res = await axiosInstance.post('/auth/login/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        navigate('/');
      } else {
        alert('로그인에 실패했습니다: ' + (res.data.error || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      if (error.response?.status === 400) {
        alert('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  const handleSignUp = () => {
    navigate('/agreement');
  };

  return (
    <div className="login-page-bg">
      <div className="magazine-title">
        <img src="/images/text-background.png" className="text-bg-img" alt="" />
        <span className="magazine-title-text">" 나만의 여행 매거진 "</span>
      </div>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-content">
            <div className="login-form-container">
              <div className="login-form-wrapper">
                <div className="login-form">
                  <div className="logo-container">
                    <img
                      src="images/odiga-logo.svg" 
                      className="logo"
                      alt="로고"
                    />
                  </div>
                  <input
                    placeholder={"아이디"}
                    value={input1}
                    onChange={(event)=>onChangeInput1(event.target.value)}
                    className="id-input"
                    onKeyPress={handleKeyPress}
                  />
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={"비밀번호"}
                      value={input2}
                      onChange={(event)=>onChangeInput2(event.target.value)}
                      className="password-input"
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="button"
                      className="password-visibility-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <img src="images/eye-open.png" alt="비밀번호 보이기" />
                      ) : (
                        <img src="images/eye-closed.png" alt="비밀번호 숨기기" />
                      )}
                    </button>
                  </div>
                  <button type="button" className="keep-login" onClick={() => setKeepLogin(!keepLogin)}>
                    <img
                      src={keepLogin ? "/images/check-on2.png" : "/images/check-off1.png"}
                      className="checkbox-icon"
                      alt="체크박스"
                    />
                    <span className="keep-login-text">
                      {"로그인 상태 유지"}
                    </span>
                  </button>
                  <button 
                    onClick={handleLogin}
                    className="login-button">
                    <span className="login-button-text">
                      {"로 그 인"}
                    </span>
                  </button>
                </div>
                <img 
                    src="/images/magazine1.png" 
                    className="magazine-bg-img_1" 
                    alt="" 
                />
                <img
                  src="/images/magazine2.png"
                  className="magazine-bg-img_2"
                  alt="배경 이미지"
                />
              </div>
              <div className="signup-link-wrap">
                <span>회원이 아니신가요?</span>
                <span
                  onClick={handleSignUp}
                  className="signup-link-text"
                  tabIndex={0}
                  role="button"
                  style={{ marginLeft: '6px' }}
                >
                  회원가입
                </span>
              </div>
            </div>
            <button 
              className="language-button"
              onClick={()=>alert("언어 변경 기능은 준비 중입니다.")}>
              <img
                src="images/language.png" 
                className="language-icon"
                alt="언어 아이콘"
              />
              <span className="language-text">
                {"한국어"}
              </span>
                <img
                  src="images/arrow.svg" 
                className="arrow-icon"
                alt="화살표 아이콘"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}