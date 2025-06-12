import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateMagazine.css";
import { FaFolderOpen, FaImage, FaFileAlt, FaPlus } from "react-icons/fa";
// 템플릿 컴포넌트 import
import { Section01 } from "../templates/Section01";
import { Section02 } from "../templates/Section02";
import { Section03 } from "../templates/Section03";
import { Section04 } from "../templates/Section04";
import { Section05 } from "../templates/Section05";
import { Section06 } from "../templates/Section06";
import { Section07 } from "../templates/Section07";
import { Section08 } from "../templates/Section08";
import { Section09 } from "../templates/Section09";
import { Section10 } from "../templates/Section10";
import { Section11 } from "../templates/Section11";
import { Section12 } from "../templates/Section12";
import { Section13 } from "../templates/Section13";
import { Section14 } from "../templates/Section14";
import { Section15 } from "../templates/Section15";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axiosInstance from "../api/axiosInstance";

export default function CreateMagazine() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const templateRef = useRef(null);
  const [mode, setMode] = useState("ai"); // 'ai'가 기본값

  // AI 매거진 생성용 state
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [aiImages, setAiImages] = useState([]); // 이미지 URL 배열
  const [aiTexts, setAiTexts] = useState([]); // 텍스트 파일 배열
  const [aiGenerating, setAIGenerating] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false); // 팝업이 기본적으로 보이지 않도록 수정

  // output 파일 목록 상태 추가
  const [outputFiles, setOutputFiles] = useState([]);

  // 템플릿 목록 정의
  const templates = [
    {
      id: 1,
      name: "템플릿 1",
      component: Section01,
      image: "/template/section1.svg",
    },
    {
      id: 2,
      name: "템플릿 2",
      component: Section02,
      image: "/template/section2.svg",
    },
    {
      id: 3,
      name: "템플릿 3",
      component: Section03,
      image: "/template/section3.svg",
    },
    {
      id: 4,
      name: "템플릿 4",
      component: Section04,
      image: "/template/section4.svg",
    },
    {
      id: 5,
      name: "템플릿 5",
      component: Section05,
      image: "/template/section5.svg",
    },
    {
      id: 6,
      name: "템플릿 6",
      component: Section06,
      image: "/template/section6.svg",
    },
    {
      id: 7,
      name: "템플릿 7",
      component: Section07,
      image: "/template/section7.svg",
    },
    {
      id: 8,
      name: "템플릿 8",
      component: Section08,
      image: "/template/section8.svg",
    },
    {
      id: 9,
      name: "템플릿 9",
      component: Section09,
      image: "/template/section9.svg",
    },
    {
      id: 10,
      name: "템플릿 10",
      component: Section10,
      image: "/template/section10.svg",
    },
    {
      id: 11,
      name: "템플릿 11",
      component: Section11,
      image: "/template/section11.svg",
    },
    {
      id: 12,
      name: "템플릿 12",
      component: Section12,
      image: "/template/section12.svg",
    },
    {
      id: 13,
      name: "템플릿 13",
      component: Section13,
      image: "/template/section13.svg",
    },
    {
      id: 14,
      name: "템플릿 14",
      component: Section14,
      image: "/template/section14.svg",
    },
    {
      id: 15,
      name: "템플릿 15",
      component: Section15,
      image: "/template/section15.svg",
    },
  ];

  useEffect(() => {
    // 템플릿이 선택되면 템플릿 선택 화면 닫기
    if (selectedTemplate) {
      setShowTemplates(false);
    }
  }, [selectedTemplate]);

  // 폴더 목록 불러오기 (API 연동)
  useEffect(() => {
    if (mode === "ai") {
      fetchFolderList();
    }
  }, [mode]);

  const fetchFolderList = async () => {
    try {
      const res = await axiosInstance.get("/storage/magazines/list/");
      const data = res.data;
      if (data.success) setFolderList(data.magazines);
      else setFolderList([]);
    } catch (e) {
      setFolderList([]);
    }
  };

  // 폴더 선택 시 이미지/텍스트 불러오기 (API 연동)
  useEffect(() => {
    if (selectedFolder) {
      fetchImageList(selectedFolder);
      fetchTextList(selectedFolder);
    } else {
      setAiImages([]);
      setAiTexts([]);
    }
  }, [selectedFolder]);

  const fetchImageList = async (magazineId) => {
    try {
      const res = await axiosInstance.get(
        `/storage/images/?magazine_id=${magazineId}`
      );
      const data = res.data;
      if (data.success) setAiImages(data.images.map((img) => img.url));
      else setAiImages([]);
    } catch (e) {
      setAiImages([]);
    }
  };

  const fetchTextList = async (magazineId) => {
    try {
      const res = await axiosInstance.get(
        `/storage/texts/list/?magazine_id=${magazineId}`
      );
      const data = res.data;
      if (data.success) setAiTexts(data.files);
      else setAiTexts([]);
    } catch (e) {
      setAiTexts([]);
    }
  };

  // output 파일 목록 불러오기 함수
  const fetchOutputFiles = async (magazineId) => {
    try {
      const res = await axiosInstance.get(
        `/storage/outputs/list/?magazine_id=${magazineId}`
      );
      if (res.data.success) setOutputFiles(res.data.files);
      else setOutputFiles([]);
    } catch (e) {
      setOutputFiles([]);
    }
  };

  // AI 생성 완료 팝업이 열릴 때 output 파일 목록 불러오기
  useEffect(() => {
    if (showAIPopup && selectedFolder) {
      fetchOutputFiles(selectedFolder);
    }
  }, [showAIPopup, selectedFolder]);

  // 다운로드 버튼 클릭 시 실제 다운로드 URL 받아서 이동
  const handleDownloadOutput = async (filename) => {
    try {
      const res = await axiosInstance.get(
        `/storage/download-output/?filename=${encodeURIComponent(
          filename
        )}&magazine_id=${selectedFolder}`
      );
      if (res.data.success && res.data.download_url) {
        window.open(res.data.download_url, "_blank");
      } else {
        alert("다운로드 URL을 가져오지 못했습니다.");
      }
    } catch (e) {
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setCoverImage(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  // 템플릿 미리보기 페이지로 이동하는 함수
  const goToTemplatePreview = () => {
    if (!selectedTemplate) {
      alert("템플릿을 먼저 선택해주세요.");
      return;
    }

    // 선택된 템플릿과 입력한 데이터를 state로 전달
    navigate(`/template-preview/${selectedTemplate.id}`, {
      state: {
        templateId: selectedTemplate.id,
        title: title || "제목",
        content: content || "내용",
        coverImage: coverImage,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 여기서 실제 서버에 데이터 전송 로직 구현 가능
    // 예: API 호출, 데이터 저장 등

    // 데모 목적으로 2초 후 제출 완료 상태로 변경
    setTimeout(() => {
      alert("매거진이 성공적으로 저장되었습니다!");
      setIsSubmitting(false);
      // 페이지 이동 또는 폼 초기화 등의 작업 가능
      setTitle("");
      setContent("");
      setCoverImage(null);
      setSelectedTemplate(null);
    }, 2000);
  };

  const toggleTemplateSelection = () => {
    setShowTemplates(!showTemplates);
  };

  // PDF 생성 함수
  const generatePDF = async () => {
    if (!selectedTemplate) {
      alert("템플릿을 먼저 선택해주세요.");
      return;
    }

    setGeneratingPDF(true);

    try {
      const templateElement = templateRef.current;

      // HTML 요소를 캔버스로 변환
      const canvas = await html2canvas(templateElement, {
        scale: 2, // 해상도를 높이기 위한 스케일 설정
        useCORS: true, // 외부 이미지 허용
        logging: false,
        backgroundColor: "#fff",
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 크기로 PDF 생성 (210mm x 297mm)
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // PDF 파일명 설정 (제목이 있으면 제목 사용, 없으면 기본 이름)
      const fileName = title ? `${title}_템플릿.pdf` : "템플릿_미리보기.pdf";

      // PDF 다운로드
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // 폴더 선택 핸들러 (더미)
  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
    // 폴더 선택 시 output 파일 목록도 조회
    fetchOutputFiles(e.target.value);
    // TODO: 폴더 선택 시 이미지/텍스트/아웃풋 조회 API 호출
  };

  // 이미지 삭제/추가 핸들러 (더미)
  const handleDeleteImage = (idx) => {
    setAiImages(aiImages.filter((_, i) => i !== idx));
  };
  const handleAddImage = (e) => {
    // TODO: 이미지 업로드 구현
    alert("이미지 업로드 기능 구현 필요");
  };

  // AI 매거진 생성 버튼 핸들러 (비동기)
  const handleAIGenerate = async () => {
    if (!selectedFolder) {
      alert("매거진 폴더를 선택해주세요.");
      return;
    }
    setAIGenerating(true);
    setShowAIPopup(false);
    try {
      const formData = new FormData();
      formData.append("magazine_id", selectedFolder);
      formData.append("image_folder", `${selectedFolder}/images`);
      formData.append("user_input", `${selectedFolder}/texts`);
      const res = await axiosInstance.post(
        "/magazine/generate-async/",
        formData
      );

      if (res.data.success) {
        // 상태 확인 시작
        checkMagazineStatus(selectedFolder);
      } else {
        alert("매거진 생성 시작 실패: " + (res.data.message || ""));
        setAIGenerating(false);
      }
    } catch (e) {
      alert("매거진 생성 중 오류가 발생했습니다.");
      setAIGenerating(false);
    }
  };

  // 매거진 생성 상태 확인 함수
  const checkMagazineStatus = async (magazineId) => {
    let attempts = 0;
    const maxAttempts = 600; // 50분 (5초 * 600회)

    const checkStatus = async () => {
      try {
        const res = await axiosInstance.get(`/magazine/status/${magazineId}`);
        const data = res.data;

        if (data.success) {
          if (data.status === "completed") {
            // 생성 완료
            setAIGenerating(false);
            setShowAIPopup(true);
            fetchOutputFiles(magazineId);
            return true;
          } else if (data.status === "failed") {
            // 생성 실패
            alert("매거진 생성 실패: " + (data.error || "알 수 없는 오류"));
            setAIGenerating(false);
            return true;
          }
        }
        return false;
      } catch (e) {
        console.error("상태 확인 중 오류:", e);
        return false;
      }
    };

    const pollStatus = async () => {
      attempts++;
      const isComplete = await checkStatus();

      if (!isComplete && attempts < maxAttempts) {
        setTimeout(pollStatus, 5000); // 5초마다 확인
      } else if (attempts >= maxAttempts) {
        alert("매거진 생성 시간이 초과되었습니다. 나중에 다시 확인해주세요.");
        setAIGenerating(false);
      }
    };

    pollStatus();
  };

  // 커뮤니티 등록 더미 함수
  const handleRegisterCommunity = () => {
    alert("커뮤니티 등록 기능은 추후 구현 예정입니다!");
  };

  return (
    <div className="magazine-create-page">
      <div className="magazine-create-header">
        <div>
          <h1>여행 매거진 만들기</h1>
          <p>나만의 여행 이야기를 공유해보세요</p>
        </div>
        <div className="mode-switch">
          <button
            className={mode === "ai" ? "active" : ""}
            onClick={() => setMode("ai")}
            style={{ fontWeight: mode === "ai" ? "bold" : "normal" }}
          >
            AI로 자동 생성
          </button>
          <button
            className={mode === "custom" ? "active" : ""}
            onClick={() => setMode("custom")}
            style={{ fontWeight: mode === "custom" ? "bold" : "normal" }}
          >
            직접 만들기
          </button>
        </div>
      </div>

      {/* 모드별 렌더링 */}
      {mode === "ai" ? (
        <div className="ai-generate-section">
          <div className="ai-folder-select">
            <label>
              <FaFolderOpen style={{ marginRight: "6px" }} />
              매거진 폴더 선택
            </label>
            <select value={selectedFolder} onChange={handleFolderChange}>
              <option value="">폴더를 선택하세요</option>
              {folderList.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
          <div className="ai-image-list">
            <label>
              <FaImage style={{ marginRight: "6px" }} />
              이미지 목록
            </label>
            <div className="ai-images">
              {aiImages.length === 0 && (
                <div className="ai-image-empty">이미지가 없습니다</div>
              )}
              {aiImages.map((img, idx) => (
                <div key={idx} className="ai-image-item">
                  <img src={img} alt={`img${idx}`} />
                  <button onClick={() => handleDeleteImage(idx)} title="삭제">
                    ×
                  </button>
                </div>
              ))}
              <button onClick={handleAddImage} className="ai-image-add-btn">
                <FaPlus /> 이미지 추가
              </button>
            </div>
          </div>
          <div className="ai-text-list">
            <label>
              <FaFileAlt style={{ marginRight: "6px" }} />
              텍스트 목록
            </label>
            <ul>
              {aiTexts.length === 0 && (
                <li className="ai-text-empty">텍스트 파일이 없습니다</li>
              )}
              {aiTexts.map((txt, idx) => (
                <li key={idx}>{txt}</li>
              ))}
            </ul>
          </div>
          <div className="ai-generate-btn-area">
            <button
              onClick={handleAIGenerate}
              disabled={!selectedFolder || aiGenerating}
            >
              {aiGenerating ? "생성 중..." : "AI로 매거진 생성"}
            </button>
            {/* 임시 생성완료 팝업 확인 버튼 */}
            <button
              type="button"
              style={{
                marginLeft: "1em",
                background: "#A294F9",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                padding: "12px 28px",
                fontSize: "16px",
                cursor: "pointer",
                display: outputFiles.some((f) =>
                  f.toLowerCase().endsWith(".pdf")
                )
                  ? "inline-block"
                  : "none",
              }}
              onClick={() => setShowAIPopup(true)}
            >
              생성된 매거진 확인
            </button>
          </div>
          {/* 팝업 오버레이 */}
          {showAIPopup && (
            <div className="ai-popup-overlay">
              <div className="ai-popup-modal">
                <button
                  className="ai-popup-close"
                  onClick={() => setShowAIPopup(false)}
                >
                  ×
                </button>
                <h2>AI 매거진 생성 완료!</h2>
                <div style={{ marginBottom: "1em" }}>
                  {/* output 파일 리스트 및 다운로드 버튼 */}
                  {outputFiles.length > 0 ? (
                    <ul style={{ padding: 0, listStyle: "none" }}>
                      {outputFiles.map((file) => (
                        <li key={file} style={{ marginBottom: "0.5em" }}>
                          <span
                            style={{
                              marginRight: "1em",
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: "#4B3DF9",
                            }}
                            onClick={() => handleDownloadOutput(file)}
                          >
                            {file}
                          </span>
                          <button
                            className="ai-pdf-download-btn"
                            onClick={() => handleDownloadOutput(file)}
                          >
                            PDF 다운로드
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>생성된 결과물이 없습니다.</div>
                  )}
                  <button
                    onClick={handleRegisterCommunity}
                    className="ai-community-btn"
                  >
                    커뮤니티에 등록
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="magazine-create-container">
            <form className="magazine-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">제목</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="매거진 제목을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cover">커버 이미지</label>
                <div className="cover-upload-area">
                  {coverImage ? (
                    <div className="cover-preview">
                      <img src={coverImage} alt="커버 미리보기" />
                      <button
                        type="button"
                        onClick={() => setCoverImage(null)}
                        className="remove-image"
                      >
                        이미지 삭제
                      </button>
                    </div>
                  ) : (
                    <div className="cover-upload">
                      <input
                        type="file"
                        id="cover"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                      />
                      <label htmlFor="cover" className="file-label">
                        <div className="upload-icon">+</div>
                        <div>이미지 업로드</div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>템플릿 선택</label>
                <div className="template-selection">
                  {selectedTemplate ? (
                    <div className="selected-template">
                      <div className="template-preview">
                        <img
                          src={selectedTemplate.image}
                          alt={selectedTemplate.name}
                        />
                        <div className="template-name">
                          {selectedTemplate.name}
                        </div>
                      </div>
                      <div className="template-buttons">
                        <button
                          type="button"
                          onClick={toggleTemplateSelection}
                          className="change-template-btn"
                        >
                          템플릿 변경하기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleTemplateSelection}
                      className="select-template-btn"
                    >
                      템플릿 선택하기
                    </button>
                  )}

                  {showTemplates && (
                    <div className="templates-modal">
                      <div className="templates-container">
                        <div className="templates-header">
                          <h3>템플릿 선택</h3>
                          <button
                            type="button"
                            onClick={() => setShowTemplates(false)}
                            className="close-btn"
                          >
                            ×
                          </button>
                        </div>
                        <div className="templates-grid">
                          {templates.map((template) => (
                            <div
                              key={template.id}
                              className={`template-item ${
                                selectedTemplate === template ? "selected" : ""
                              }`}
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <div className="template-item-preview">
                                <img src={template.image} alt={template.name} />
                              </div>
                              <div className="template-item-name">
                                {template.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="content">내용</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                  placeholder="여행 이야기를 들려주세요..."
                  rows={10}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button">
                  취소
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || !selectedTemplate}
                >
                  {isSubmitting ? "저장 중..." : "매거진 저장"}
                </button>
              </div>
            </form>

            <div className="magazine-preview">
              <h2>미리보기</h2>
              <div className="preview-container">
                {coverImage && (
                  <div className="preview-cover">
                    <img src={coverImage} alt="매거진 커버" />
                  </div>
                )}
                <div className="preview-content">
                  <h3>{title || "제목"}</h3>
                  {selectedTemplate ? (
                    <div className="template-preview-area" ref={templateRef}>
                      <div className="template-content">
                        {/* 실제 템플릿 컴포넌트 렌더링 */}
                        {React.createElement(selectedTemplate.component, {
                          title: title || "제목",
                          content: content || "내용",
                          coverImage: coverImage || null,
                          titleClassName: `auto-resize-text ${
                            title && title.length > 20
                              ? title.length > 30
                                ? title.length > 40
                                  ? "length-extremely-long"
                                  : "length-very-long"
                                : "length-long"
                              : ""
                          }`,
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="no-template-selected">
                      템플릿을 선택해주세요
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
