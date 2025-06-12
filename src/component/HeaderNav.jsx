import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/HeaderNav.css";

export default function HeaderNav() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="home-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/r4tnkpw7_expires_30_days.png"
            className="header-logo"
            alt="로고"
          />
        </Link>
        {/* 데스크톱 메뉴 */}
        <div className="desktop-menu">
          <Link to="/travel-record" className="header-menu">여행기록</Link>
          <Link to="/create-magazine" className="header-menu">매거진</Link>
          <Link to="/community" className="header-menu community">커뮤니티</Link>
        </div>
        <div className="header-right desktop-menu">
          <span className="header-links">
            {userID ? (
              <>
                <span>{userName}님 어서오세요</span> | <span style={{cursor:'pointer', color:'#a294f9'}} onClick={handleLogout}>로그아웃</span> | <Link to="/orders">주문조회</Link> | <Link to="/inquiry">문의하기</Link>
              </>
            ) : (
              <>
                <Link to="/agreement">회원가입</Link> | <Link to="/login">로그인</Link> | <Link to="/orders">주문조회</Link> | <Link to="/inquiry">문의하기</Link>
              </>
            )}
          </span>
          <div className="header-icons">
            <Link to="/search">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/0yye59c2_expires_30_days.png"
                className="header-icon"
                alt="검색"
                title="검색"
              />
            </Link>
            <Link to="/cart">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/qsnexk7t_expires_30_days.png"
                className="header-icon"
                alt="장바구니"
                title="장바구니"
              />
            </Link>
            <Link to="/mypage">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/8n6v7u5o_expires_30_days.png"
                className="header-icon"
                alt="마이페이지"
                title="마이페이지"
              />
            </Link>
          </div>
        </div>
        {/* 모바일 햄버거 메뉴 버튼 */}
        <button className="hamburger-menu" onClick={() => setIsMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        {/* 모바일 사이드 메뉴 */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}>×</button>
          {/* 1. 상단: 유저 인사 */}
          <div style={{width:'100%', marginBottom:'10px'}}>
            {userID ? (
              <span className="mobile-user-name">{userName}님 어서오세요</span>
            ) : (
              <>
                <Link to="/login" className="mobile-login-btn" onClick={()=>setIsMenuOpen(false)}>로그인</Link>
                <Link to="/agreement" className="mobile-signup-btn" onClick={()=>setIsMenuOpen(false)}>회원가입</Link>
              </>
            )}
          </div>
          {/* 2. 아이콘 우측 정렬 */}
          <div className="mobile-menu-icons">
            <Link to="/search" onClick={()=>setIsMenuOpen(false)}>
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/0yye59c2_expires_30_days.png" alt="검색" />
            </Link>
            <Link to="/cart" onClick={()=>setIsMenuOpen(false)}>
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/qsnexk7t_expires_30_days.png" alt="장바구니" />
            </Link>
            <Link to="/mypage" onClick={()=>setIsMenuOpen(false)}>
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/AiqsF1Zsxi/8n6v7u5o_expires_30_days.png" alt="마이페이지" />
            </Link>
          </div>
          {/* 3. 메뉴 리스트 */}
          <div className="mobile-menu-links">
            <Link to="/travel-record" className="mobile-menu-link" onClick={()=>setIsMenuOpen(false)}>여행기록</Link>
            <Link to="/create-magazine" className="mobile-menu-link" onClick={()=>setIsMenuOpen(false)}>매거진</Link>
            <Link to="/community" className="mobile-menu-link" onClick={()=>setIsMenuOpen(false)}>커뮤니티</Link>
            <Link to="/orders" className="mobile-menu-link" onClick={()=>setIsMenuOpen(false)}>주문조회</Link>
            <Link to="/inquiry" className="mobile-menu-link" onClick={()=>setIsMenuOpen(false)}>문의하기</Link>
          </div>
          {/* 4. 로그아웃 */}
          {userID && (
            <button onClick={handleLogout} className="mobile-logout-btn">로그아웃</button>
          )}
        </div>
      </div>
    </div>
  );
}