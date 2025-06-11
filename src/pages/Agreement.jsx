import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Agreement.css";

const CHECK_ON = "/images/check-on2.png";
const CHECK_OFF = "/images/check-off1.png";

export default function Agreement() {
  const navigate = useNavigate();
  // 각 항목별 동의 상태 관리
  const [allChecked, setAllChecked] = useState(false);
  const [checks, setChecks] = useState([
    false, // 약관1
    false, // 약관2
    false, // 약관3
    false, // 약관4
    false  // 이벤트
  ]);

  // 전체 동의 토글
  const handleAllCheck = () => {
    const next = !allChecked;
    setAllChecked(next);
    setChecks([next, next, next, next, next]);
  };

  // 개별 체크 토글
  const handleCheck = idx => {
    const nextChecks = [...checks];
    nextChecks[idx] = !nextChecks[idx];
    setChecks(nextChecks);
    // 전체 동의 상태도 동기화
    setAllChecked(nextChecks.every(Boolean));
  };

  // 다음 버튼 클릭 시 회원가입 페이지로 이동
  const handleNext = () => {
    navigate('/signup');
  };

  return (
    <div className="agreement-bg">
      <div className="agreement-wrapper">
        <div className="agreement-content">
          <div className="agreement-box">
            <div className="agreement-all-check agreement-checkbox-row" onClick={handleAllCheck} style={{cursor:'pointer'}}>
              <img src={allChecked ? CHECK_ON : CHECK_OFF} className="checkbox-icon" alt="전체 동의 체크박스" />
              <span className="agreement-all-check-text">전체 동의하기</span>
            </div>
            <span className="agreement-desc">
              실명 인증된 아이디로 가입, 위치기반서비스 이용약관(선택), 이벤트・혜택 정보 수신(선택) 동의를 포함합니다.
            </span>
            <div className="agreement-checkbox-row" onClick={()=>handleCheck(0)} style={{cursor:'pointer'}}>
              <img src={checks[0] ? CHECK_ON : CHECK_OFF} className="checkbox-icon" alt="약관1 체크박스" />
              <span className="agreement-required">(필수)</span>
              <span className="agreement-checkbox-label">오디가 이용약관</span>
            </div>
            <div className="agreement-section">
              <span className="agreement-section-title">여러분을 환영합니다.</span>
              <span className="agreement-section-desc">
                오디가 서비스 및 제품(이하 '서비스')을 이용해 주셔서 감사합니다. 본 약관은 다양한 오디가 서비스의 이용과 관련하여 오디가 서비스를 제공하는 오디가 주식회사(이하 '오디가')와 이를 이용하는 오디가 서비스 회원(이하 '회원') 또는 비회원과의 관계를 설명하며, 아울러 여러분의 네이버 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다.
              </span>
            </div>
            <div className="agreement-checkbox-row" onClick={()=>handleCheck(1)} style={{cursor:'pointer'}}>
              <img src={checks[1] ? CHECK_ON : CHECK_OFF} className="checkbox-icon" alt="약관2 체크박스" />
              <span className="agreement-required">(필수)</span>
              <span className="agreement-checkbox-label">개인정보 수집 및 이용</span>
            </div>
            <div className="agreement-section">
              <span className="agreement-section-desc">
                개인정보보호법에 따라 오디가에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
              </span>
            </div>
            <div className="agreement-checkbox-row" onClick={()=>handleCheck(2)} style={{cursor:'pointer'}}>
              <img src={checks[2] ? CHECK_ON : CHECK_OFF} className="checkbox-icon" alt="약관3 체크박스" />
              <span className="agreement-optional">(선택)</span>
              <span className="agreement-checkbox-label">위치기반서비스 이용약관</span>
            </div>
            <div className="agreement-section">
              <span className="agreement-section-desc">
                위치기반서비스 이용약관에 동의하시면, 위치를 활용한 광고 정보 수신등을 포함하는 위치기반 서비스를 이용할 수 있습니다.\n\n\n이 약관은 오디가 주식회사 (이하 "회사")가 제공하는 위치기반서비스와 관련하여 회사와 개인위치정보주체와의 권리, 의무 및 책임사항, 기타\n필요한 사항을 규정함을 목적으로 합니다.
              </span>
            </div>
            <div className="agreement-checkbox-row" onClick={()=>handleCheck(3)} style={{cursor:'pointer'}}>
              <img src={checks[3] ? CHECK_ON : CHECK_OFF} className="checkbox-icon" alt="약관4 체크박스" />
              <span className="agreement-optional">(선택)</span>
              <span className="agreement-checkbox-label">개인정보 수집 및 이용(이벤트)</span>
            </div>
            <div className="agreement-section agreement-event">
              <span className="agreement-section-desc agreement-event-text"> - 이벤트・혜택 정보 수신</span>
            </div>
            <button className="agreement-next-btn" type="button" onClick={handleNext}>
              다음
            </button>
          </div>
          <div className="agreement-side-box agreement-side-box-1">
            <img src="/images/background-img2.png" className="agreement-side-img" alt="side1" />
          </div>
          <div className="agreement-side-box agreement-side-box-2">
            <img src="/images/background-img1.png" className="agreement-side-img" alt="side2" />
          </div>
          <img
            src="images/odi-camera.png"
            className="agreement-bg-img"
            alt="bg"
          />
          <img
            src="/images/shadow.png"
            className="agreement-bg-shadow"
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