import React, { useState } from "react";
import "../styles/MyPage.css";

export default function Mypage({ user, articles, currentUser }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userName: user?.userName || "",
    userCountry: user?.userCountry || "",
    userLanguage: user?.userLanguage || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: 서버 PATCH 요청 구현
    setEditMode(false);
    // 성공 시 user 정보 갱신 필요
  };

  const handleCancel = () => {
    setForm({
      userName: user?.userName || "",
      userCountry: user?.userCountry || "",
      userLanguage: user?.userLanguage || "",
    });
    setEditMode(false);
  };

  return (
    <div className="mypage-container">
      <div className="mypage-profile">
        <div className="mypage-profile-header">
          <span className="mypage-profile-title">내 프로필</span>
          {editMode ? (
            <div className="mypage-profile-edit-btn-group">
              <button className="mypage-profile-edit-btn save" onClick={handleSave}>저장</button>
              <button className="mypage-profile-edit-btn cancel" onClick={handleCancel}>취소</button>
            </div>
          ) : (
            <button className="mypage-profile-edit-btn" onClick={e => {e.preventDefault(); setEditMode(true);}}>수정</button>
          )}
        </div>
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필 사진"
            className="mypage-profile-img"
          />
        ) : (
          <div className="mypage-noimg">프로필 사진이 <br/>없습니다.</div>
        )}
        <ul className="mypage-info">
          <li>
            <b>이름 &nbsp;&nbsp;&nbsp;&nbsp;:</b>
            {editMode ? (
              <input name="userName" value={form.userName} onChange={handleChange} className="mypage-inline-input" />
            ) : (
              <span>{user?.userName}</span>
            )}
          </li>
          <li>
            <b>국가 &nbsp;&nbsp;&nbsp;&nbsp;:</b>
            {editMode ? (
              <input name="userCountry" value={form.userCountry} onChange={handleChange} className="mypage-inline-input" />
            ) : (
              <span>{user?.userCountry}</span>
            )}
          </li>
          <li>
            <b>이메일 :</b>
            {editMode ? (
              <input name="userLanguage" value={form.userLanguage} onChange={handleChange} className="mypage-inline-input" />
            ) : (
              <span>{user?.userLanguage}</span>
            )}
          </li>
        </ul>
      </div>

      <div className="mypage-articles">
        <h2>내가 쓴 글</h2>
        {articles && articles.length > 0 ? (
          <ul>
            {articles.map((art) => (
              <li key={art.articleID}>
                <a href={`/articles/${art.articleID}`}>{art.articleTitle}</a>
                <small>({art.createdAt?.slice(0, 10)})</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 작성한 글이 없습니다.</p>
        )}
      </div>

      <div className="mypage-actions">
        <div className="mypage-btn-group">
          <a href="/delete_account/" className="mypage-btn danger">회원 탈퇴</a>
        </div>
      </div>
    </div>
  );
}
