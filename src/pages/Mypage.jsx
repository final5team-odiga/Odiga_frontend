import React, { useState, useEffect } from "react";
import "../styles/MyPage.css";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

export default function Mypage({ user, articles, currentUser }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userName: user?.userName || "",
    userCountry: user?.userCountry || "",
    userLanguage: user?.userLanguage || "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || "");
  const [userData, setUserData] = useState(null);
  const [userArticles, setUserArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/mypage/");
        if (res.data.success) {
          setUserData(res.data.user);
          setUserArticles(res.data.user.myArticles || []);
        }
      } catch (e) {
        alert("프로필 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("userEmail", user.userEmail); // 이메일은 수정 불가라면 user.userEmail 사용
      formData.append("userCountry", form.userCountry);
      formData.append("userLanguage", form.userLanguage);
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }
      // 인증 필요시 헤더에 토큰 추가
      await axiosInstance.put("/profile/", formData);
      alert("프로필이 성공적으로 수정되었습니다.");
      setEditMode(false);
      // TODO: 프로필 정보 갱신 필요시, 상위 컴포넌트에서 user 정보 리패치
    } catch (e) {
      alert("프로필 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setForm({
      userName: user?.userName || "",
      userCountry: user?.userCountry || "",
      userLanguage: user?.userLanguage || "",
    });
    setEditMode(false);
  };

  if (loading) return <div>로딩 중...</div>;

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
        {userData?.profileImage || profileImagePreview ? (
          <img
            src={profileImagePreview || userData.profileImage}
            alt="프로필 사진"
            className="mypage-profile-img"
          />
        ) : (
          <div className="mypage-noimg">프로필 사진이 <br/>없습니다.</div>
        )}
        {editMode && (
          <div style={{marginTop:'0.5em'}}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        )}
        <ul className="mypage-info">
          <li>
            <b>아이디 :</b> <span>{userData?.userID || '-'}</span>
          </li>
          <li>
            <b>이름 &nbsp;&nbsp;&nbsp;&nbsp;:</b>
            {editMode ? (
              <input name="userName" value={form.userName} onChange={handleChange} className="mypage-inline-input" />
            ) : (
              <span>{userData?.userName || '-'}</span>
            )}
          </li>
          <li>
            <b>국가 &nbsp;&nbsp;&nbsp;&nbsp;:</b>
            {editMode ? (
              <input name="userCountry" value={form.userCountry} onChange={handleChange} className="mypage-inline-input" />
            ) : (
              <span>{userData?.userCountry || '-'}</span>
            )}
          </li>
          <li>
            <b>이메일 :</b> <span>{userData?.userEmail || '-'}</span>
          </li>
        </ul>
      </div>

      <div className="mypage-articles">
        <h2>내가 쓴 글</h2>
        {userArticles && userArticles.length > 0 ? (
          <ul>
            {userArticles.map((art) => (
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
