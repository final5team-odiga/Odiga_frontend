import React, { useState } from "react";
import "../styles/Inquiry.css";

export default function Inquiry() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    // 실제 문의 등록 로직은 API 연동 필요
    alert("문의가 접수되었습니다! (더미)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="Inquiry-container">
      <h1 className="Inquiry-title">문의하기</h1>
      <form className="Inquiry-form" onSubmit={handleSubmit}>
        <div className="Inquiry-row">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="Inquiry-input"
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        <div className="Inquiry-row">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="Inquiry-input"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className="Inquiry-row">
          <label>문의 내용</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="Inquiry-textarea"
            placeholder="문의 내용을 입력하세요"
            rows={7}
            required
          />
        </div>
        <div className="Inquiry-btns">
          <button type="submit" className="Inquiry-submit">문의하기</button>
        </div>
      </form>
    </div>
  );
} 