import React, { useState, useRef } from "react";
import "../styles/CommunityWrite.css";
import { useNavigate } from "react-router-dom";

export default function CommunityWrite() {
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInput = useRef();
  const navigate = useNavigate();

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !region.trim() || !content.trim()) {
      alert("제목, 지역, 본문을 모두 입력해 주세요.");
      return;
    }
    // 실제 등록 로직은 API 연동 필요
    alert("글이 등록되었습니다! (더미)");
    navigate("/community");
  };

  return (
    <div className="CommunityWrite-container">
      <h1 className="CommunityWrite-title">커뮤니티 글쓰기</h1>
      <form className="CommunityWrite-form" onSubmit={handleSubmit}>
        <div className="CommunityWrite-row">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="CommunityWrite-input"
            placeholder="제목을 입력하세요"
            maxLength={50}
            required
          />
        </div>
        <div className="CommunityWrite-row">
          <label>지역</label>
          <input
            type="text"
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="CommunityWrite-input"
            placeholder="지역을 입력하세요"
            maxLength={20}
            required
          />
        </div>
        <div className="CommunityWrite-row">
          <label>썸네일</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleImageChange}
            className="CommunityWrite-file"
          />
          {imageUrl && (
            <img src={imageUrl} alt="썸네일 미리보기" className="CommunityWrite-thumb" />
          )}
        </div>
        <div className="CommunityWrite-row">
          <label>본문</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="CommunityWrite-textarea"
            placeholder="내용을 입력하세요"
            rows={8}
            required
          />
        </div>
        <div className="CommunityWrite-btns">
          <button type="submit" className="CommunityWrite-submit">등록</button>
          <button type="button" className="CommunityWrite-cancel" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
} 