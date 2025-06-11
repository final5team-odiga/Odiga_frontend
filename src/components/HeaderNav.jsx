import React from "react";
import { Link } from "react-router-dom";
import "../styles/HeaderNav.css";

export default function HeaderNav() {
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
        <Link to="/travel-record" className="header-menu">여행기록</Link>
        <Link to="/create-magazine" className="header-menu">매거진</Link>
        <Link to="/community" className="header-menu community">커뮤니티</Link>
        <div className="header-right">
          <span className="header-links">
            <Link to="/agreement">회원가입</Link> | <Link to="/login">로그인</Link> | <Link to="/orders">주문조회</Link> | <Link to="/inquiry">문의하기</Link> 
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
      </div>
    </div>
  );
}