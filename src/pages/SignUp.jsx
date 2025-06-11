import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import { signup, checkUserId } from "../api/user";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [idCheck, setIdCheck] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [language, setLanguage] = useState('한국어');
  const [customDomain, setCustomDomain] = useState('');

  const checkUserIdHandler = async () => {
    if (!userId) {
      alert('아이디를 입력해주세요.');
      return;
    }
    try {
      const data = await checkUserId(userId);
      if (data.available) {
        setIdCheck(true);
        alert('사용 가능한 아이디입니다.');
      } else {
        setIdCheck(false);
        alert('이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      alert('ID 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNext = async () => {
    if (!idCheck) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }
    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!email || !emailDomain) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const finalDomain = emailDomain === "직접입력" ? customDomain : emailDomain;
      await signup({
        userID: userId,
        userName: name,
        password,
        userEmail: `${email}@${finalDomain}`,
        userCountry: country,
        userLanguage: language || '한국어',
      });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (e) {
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="signup-bg">
      <div className="signup-wrapper">
        <div className="signup-content">
          <div className="signup-box">
            <div className="signup-form">
              <label className="signup-label">이름</label>
              <input
                className="signup-input"
                placeholder="이름 입력"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <label className="signup-label">아이디</label>
              <div className="signup-id-row">
                <input
                  className="signup-input"
                  placeholder="아이디 입력"
                  value={userId}
                  onChange={e => {
                    setUserId(e.target.value);
                    setIdCheck(false);
                  }}
                />
                <button 
                  className="signup-id-check-btn"
                  onClick={checkUserIdHandler}
                >
                  중복<br />확인
                </button>
              </div>

              <label className="signup-label">비밀번호</label>
              <input
                className="signup-input"
                placeholder="비밀번호 입력"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <input
                className="signup-input"
                placeholder="비밀번호 확인"
                type="password"
                value={passwordCheck}
                onChange={e => setPasswordCheck(e.target.value)}
              />

              <label className="signup-label">국가</label>
              <div className="signup-select-row">
                <select
                  className="signup-select"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                >
                  <option value="">국가 선택</option>
                  <option value="kr">대한민국</option>
                  <option value="us">미국</option>
                </select>
              </div>

              <label className="signup-label">이메일</label>
              <div className="signup-email-row">
                <input
                  className="signup-input signup-email-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="이메일"
                />
                <span className="signup-email-at">@</span>
                {emailDomain === "직접입력" ? (
                  <input
                    className="signup-input signup-email-input"
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    placeholder="도메인 직접 입력"
                  />
                ) : (
                  <select
                    className="signup-input signup-email-select"
                    value={emailDomain}
                    onChange={e => setEmailDomain(e.target.value)}
                  >
                    <option value="">도메인 선택</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="hotmail.com">hotmail.com</option>
                    <option value="yahoo.com">yahoo.com</option>
                    <option value="직접입력">직접입력</option>
                  </select>
                )}
              </div>

              <button className="signup-next-btn" onClick={handleNext}>다음</button>
            </div>
          </div>
          <div className="signup-side-box signup-side-box-1">
            <img src="/images/magazine3.png" className="signup-side-img" alt="side1" />
          </div>
          <div className="signup-side-box signup-side-box-2">
            <img src="/images/odi-hide.png" className="signup-side-img" alt="side2" />
          </div>
          <img
            src="/images/shadow.png"
            className="signup-bg-shadow"
            alt="bg-shadow"
          />
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
  );
}