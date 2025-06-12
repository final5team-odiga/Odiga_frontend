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
  const [mode, setMode] = useState("ai");

  // AI 매거진 생성용 state
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [aiImages, setAiImages] = useState([]);
  const [aiTexts, setAiTexts] = useState([]);
  const [aiGenerating, setAIGenerating] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [outputFiles, setOutputFiles] = useState([]);

  // 인증 관련 state 추가
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

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

  // 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    try {
      console.log("인증 상태 확인 시작");
      const response = await fetch("/.auth/me");
      const authInfo = await response.json();

      console.log("인증 정보:", authInfo);

      if (authInfo && authInfo.length > 0 && authInfo[0].userId) {
        setIsAuthenticated(true);
        localStorage.setItem("userID", authInfo[0].userId);
        localStorage.setItem(
          "userName",
          authInfo[0].userDetails ||
            authInfo[0].userClaims?.find((c) => c.typ === "name")?.val ||
            ""
        );
        console.log("인증 성공:", authInfo[0].userId);
      } else {
        console.log("인증되지 않은 사용자 - 로그인으로 리디렉션");
        setIsAuthenticated(false);
        window.location.href = "/.auth/login/aad";
      }
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      setIsAuthenticated(false);
      window.location.href = "/.auth/login/aad";
    } finally {
      setAuthChecking(false);
    }
  };

  // 컴포넌트 마운트 시 인증 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setShowTemplates(false);
    }
  }, [selectedTemplate]);

  // 폴더 목록 불러오기 (개선된 버전)
  const fetchFolderList = async () => {
    if (!isAuthenticated) {
      console.log("인증되지 않은 사용자 - 폴더 목록 조회 중단");
      return;
    }

    try {
      console.log("매거진 리스트 요청 시작");
      const res = await axiosInstance.get("/storage/magazines/list/");
      console.log("API 응답:", res);

      const data = res.data;
      if (data.success) {
        setFolderList(data.magazines);
        console.log("매거진 리스트:", data.magazines);
      } else {
        console.error("API 성공했지만 success: false", data);
        setFolderList([]);
      }
    } catch (error) {
      console.error("매거진 리스트 API 오류:", error);

      if (error.response?.status === 401) {
        console.log("인증 토큰 만료 - 재로그인 필요");
        localStorage.removeItem("userID");
        localStorage.removeItem("userName");
        setIsAuthenticated(false);
        window.location.href = "/.auth/login/aad";
      } else if (error.response?.status === 403) {
        alert("접근 권한이 없습니다.");
      } else {
        console.error("응답 상태:", error.response?.status);
        console.error("응답 데이터:", error.response?.data);
        alert(
          `매거진 리스트를 불러오는데 실패했습니다: ${
            error.response?.status || error.message
          }`
        );
      }
      setFolderList([]);
    }
  };

  // mode가 'ai'이고 인증된 상태일 때만 폴더 목록 불러오기
  useEffect(() => {
    if (mode === "ai" && isAuthenticated && !authChecking) {
      fetchFolderList();
    }
  }, [mode, isAuthenticated, authChecking]);

  // 폴더 선택 시 이미지/텍스트 불러오기
  useEffect(() => {
    if (selectedFolder && isAuthenticated) {
      fetchImageList(selectedFolder);
      fetchTextList(selectedFolder);
    } else {
      setAiImages([]);
      setAiTexts([]);
    }
  }, [selectedFolder, isAuthenticated]);

  const fetchImageList = async (magazineId) => {
    try {
      console.log(`이미지 리스트 요청: ${magazineId}`);
      const res = await axiosInstance.get(
        `/storage/images/?magazine_id=${magazineId}`
      );
      const data = res.data;
      if (data.success) {
        setAiImages(data.images.map((img) => img.url));
        console.log("이미지 리스트:", data.images);
      } else {
        setAiImages([]);
      }
    } catch (error) {
      console.error("이미지 리스트 오류:", error);
      if (error.response?.status === 401) {
        window.location.href = "/.auth/login/aad";
      }
      setAiImages([]);
    }
  };

  const fetchTextList = async (magazineId) => {
    try {
      console.log(`텍스트 리스트 요청: ${magazineId}`);
      const res = await axiosInstance.get(
        `/storage/texts/list/?magazine_id=${magazineId}`
      );
      const data = res.data;
      if (data.success) {
        setAiTexts(data.files);
        console.log("텍스트 리스트:", data.files);
      } else {
        setAiTexts([]);
      }
    } catch (error) {
      console.error("텍스트 리스트 오류:", error);
      if (error.response?.status === 401) {
        window.location.href = "/.auth/login/aad";
      }
      setAiTexts([]);
    }
  };

  const fetchOutputFiles = async (magazineId) => {
    try {
      console.log(`아웃풋 파일 리스트 요청: ${magazineId}`);
      const res = await axiosInstance.get(
        `/storage/outputs/list/?magazine_id=${magazineId}`
      );
      if (res.data.success) {
        setOutputFiles(res.data.files);
        console.log("아웃풋 파일 리스트:", res.data.files);
      } else {
        setOutputFiles([]);
      }
    } catch (error) {
      console.error("아웃풋 파일 리스트 오류:", error);
      if (error.response?.status === 401) {
        window.location.href = "/.auth/login/aad";
      }
      setOutputFiles([]);
    }
  };

  useEffect(() => {
    if (showAIPopup && selectedFolder) {
      fetchOutputFiles(selectedFolder);
    }
  }, [showAIPopup, selectedFolder]);

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
    } catch (error) {
      console.error("다운로드 오류:", error);
      if (error.response?.status === 401) {
        window.location.href = "/.auth/login/aad";
      } else {
        alert("다운로드 중 오류가 발생했습니다.");
      }
    }
  };

  // 인증 확인 중일 때 로딩 표시
  if (authChecking) {
    return (
      <div className="login-page-bg">
        <div className="login-container">
          <div className="login-wrapper">
            <div className="login-content">
              <div style={{ textAlign: "center", color: "white" }}>
                <p>인증 상태 확인 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="login-page-bg">
        <div className="login-container">
          <div className="login-wrapper">
            <div className="login-content">
              <div style={{ textAlign: "center", color: "white" }}>
                <p>로그인이 필요합니다. 잠시 후 로그인 페이지로 이동합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 기존 핸들러 함수들 (변경 없음)
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

  const goToTemplatePreview = () => {
    if (!selectedTemplate) {
      alert("템플릿을 먼저 선택해주세요.");
      return;
    }
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
    setTimeout(() => {
      alert("매거진이 성공적으로 저장되었습니다!");
      setIsSubmitting(false);
      setTitle("");
      setContent("");
      setCoverImage(null);
      setSelectedTemplate(null);
    }, 2000);
  };

  const toggleTemplateSelection = () => {
    setShowTemplates(!showTemplates);
  };

  const generatePDF = async () => {
    if (!selectedTemplate) {
      alert("템플릿을 먼저 선택해주세요.");
      return;
    }
    setGeneratingPDF(true);
    try {
      const templateElement = templateRef.current;
      const canvas = await html2canvas(templateElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      const fileName = title ? `${title}_템플릿.pdf` : "템플릿_미리보기.pdf";
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
    if (e.target.value) {
      fetchOutputFiles(e.target.value);
    }
  };

  const handleDeleteImage = (idx) => {
    setAiImages(aiImages.filter((_, i) => i !== idx));
  };

  const handleAddImage = (e) => {
    alert("이미지 업로드 기능 구현 필요");
  };

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
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        checkMagazineStatus(selectedFolder);
      } else {
        alert("매거진 생성 시작 실패: " + (res.data.message || ""));
        setAIGenerating(false);
      }
    } catch (error) {
      console.error("AI 생성 오류:", error);
      if (error.response?.status === 401) {
        window.location.href = "/.auth/login/aad";
      } else {
        alert("매거진 생성 중 오류가 발생했습니다.");
      }
      setAIGenerating(false);
    }
  };

  const checkMagazineStatus = async (magazineId) => {
    let attempts = 0;
    const maxAttempts = 600;
    const checkStatus = async () => {
      try {
        const res = await axiosInstance.get(`/magazine/status/${magazineId}`);
        const data = res.data;
        if (data.success) {
          if (data.status === "completed") {
            setAIGenerating(false);
            setShowAIPopup(true);
            fetchOutputFiles(magazineId);
            return true;
          } else if (data.status === "failed") {
            alert("매거진 생성 실패: " + (data.error || "알 수 없는 오류"));
            setAIGenerating(false);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("상태 확인 중 오류:", error);
        if (error.response?.status === 401) {
          window.location.href = "/.auth/login/aad";
        }
        return false;
      }
    };
    const pollStatus = async () => {
      attempts++;
      const isComplete = await checkStatus();
      if (!isComplete && attempts < maxAttempts) {
        setTimeout(pollStatus, 5000);
      } else if (attempts >= maxAttempts) {
        alert("매거진 생성 시간이 초과되었습니다. 나중에 다시 확인해주세요.");
        setAIGenerating(false);
      }
    };
    pollStatus();
  };

  const handleRegisterCommunity = () => {
    alert("커뮤니티 등록 기능은 추후 구현 예정입니다!");
  };

  // 기존 JSX 반환 부분은 그대로 유지
  return (
    <div className="create-magazine-container">
      <div className="magazine-title">
        <img src="/images/text-background.png" className="text-bg-img" alt="" />
        <span className="magazine-title-text">
          " 나만의 여행 이야기를 공유해보세요 "
        </span>
      </div>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === "ai" ? "active" : ""}`}
          onClick={() => setMode("ai")}
        >
          AI 매거진 생성
        </button>
        <button
          className={`mode-btn ${mode === "manual" ? "active" : ""}`}
          onClick={() => setMode("manual")}
        >
          직접 매거진 생성
        </button>
      </div>

      {mode === "ai" ? (
        <div className="ai-magazine-section">
          <h2>AI 매거진 생성</h2>

          <div className="folder-selection">
            <label htmlFor="folder-select">매거진 폴더 선택:</label>
            <select
              id="folder-select"
              value={selectedFolder}
              onChange={handleFolderChange}
              className="folder-select"
            >
              <option value="">폴더를 선택하세요</option>
              {folderList.map((folder, idx) => (
                <option key={idx} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>

          {selectedFolder && (
            <div className="selected-content">
              <div className="content-section">
                <h3>
                  <FaImage /> 이미지 ({aiImages.length}개)
                </h3>
                <div className="image-grid">
                  {aiImages.map((imgUrl, idx) => (
                    <div key={idx} className="image-item">
                      <img src={imgUrl} alt={`이미지 ${idx + 1}`} />
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="add-image-btn" onClick={handleAddImage}>
                    <FaPlus />
                    <span>이미지 추가</span>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h3>
                  <FaFileAlt /> 텍스트 파일 ({aiTexts.length}개)
                </h3>
                <div className="text-files">
                  {aiTexts.map((file, idx) => (
                    <div key={idx} className="text-file-item">
                      <FaFileAlt />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="ai-generate-btn"
                onClick={handleAIGenerate}
                disabled={aiGenerating}
              >
                {aiGenerating ? "AI 매거진 생성 중..." : "AI 매거진 생성"}
              </button>

              {aiGenerating && (
                <div className="generating-status">
                  <p>🔄 AI가 매거진을 생성하고 있습니다...</p>
                  <p>최대 50분 정도 소요될 수 있습니다.</p>
                </div>
              )}
            </div>
          )}

          {showAIPopup && (
            <div className="ai-popup-overlay">
              <div className="ai-popup">
                <h3>✅ AI 매거진 생성 완료!</h3>
                <p>매거진이 성공적으로 생성되었습니다.</p>

                <div className="output-files-section">
                  <h4>생성된 파일들:</h4>
                  {outputFiles.length > 0 ? (
                    <ul className="output-files-list">
                      {outputFiles.map((file, idx) => (
                        <li key={idx}>
                          <span>{file}</span>
                          <button
                            onClick={() => handleDownloadOutput(file)}
                            className="download-btn"
                          >
                            다운로드
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>생성된 파일이 없습니다.</p>
                  )}
                </div>

                <div className="popup-actions">
                  <button
                    onClick={handleRegisterCommunity}
                    className="register-btn"
                  >
                    커뮤니티에 등록
                  </button>
                  <button
                    onClick={() => setShowAIPopup(false)}
                    className="close-btn"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="manual-magazine-section">
          <form onSubmit={handleSubmit} className="magazine-form">
            <div className="form-group">
              <label htmlFor="title">제목:</label>
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
              <label htmlFor="content">내용:</label>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder="매거진 내용을 입력하세요"
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cover-image">커버 이미지:</label>
              <input
                type="file"
                id="cover-image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {coverImage && (
                <div className="cover-image-preview">
                  <img src={coverImage} alt="커버 이미지 미리보기" />
                </div>
              )}
            </div>

            <div className="template-section">
              <button
                type="button"
                onClick={toggleTemplateSelection}
                className="template-toggle-btn"
              >
                {showTemplates ? "템플릿 선택 닫기" : "템플릿 선택"}
              </button>

              {selectedTemplate && (
                <div className="selected-template-info">
                  <h3>선택된 템플릿: {selectedTemplate.name}</h3>
                  <img
                    src={selectedTemplate.image}
                    alt={selectedTemplate.name}
                    className="selected-template-image"
                  />
                </div>
              )}

              {showTemplates && (
                <div className="template-grid">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`template-item ${
                        selectedTemplate?.id === template.id ? "selected" : ""
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <img src={template.image} alt={template.name} />
                      <p>{template.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={goToTemplatePreview}
                className="preview-btn"
                disabled={!selectedTemplate}
              >
                템플릿 미리보기
              </button>

              <button
                type="button"
                onClick={generatePDF}
                className="pdf-btn"
                disabled={!selectedTemplate || generatingPDF}
              >
                {generatingPDF ? "PDF 생성 중..." : "PDF 생성"}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? "저장 중..." : "매거진 저장"}
              </button>
            </div>
          </form>

          {selectedTemplate && (
            <div className="template-preview" ref={templateRef}>
              <selectedTemplate.component
                title={title || "제목"}
                content={content || "내용"}
                coverImage={coverImage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
