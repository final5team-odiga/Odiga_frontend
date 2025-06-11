import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TemplatePreview.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 템플릿 이미지 매핑
const TemplateImages = {
  "1": "/template/section1.svg",
  "2": "/template/section2.svg",
  "3": "/template/section3.svg",
  "4": "/template/section4.svg",
  "5": "/template/section5.svg",
  "6": "/template/section6.svg",
  "7": "/template/section7.svg",
  "8": "/template/section8.svg",
  "9": "/template/section9.svg",
  "10": "/template/section10.svg",
  "11": "/template/section11.svg",
  "12": "/template/section12.svg",
  "13": "/template/section13.svg",
  "14": "/template/section14.svg",
  "15": "/template/section15.svg",
};

// 템플릿 설명
const TemplateDescriptions = {
  "1": "양쪽 분할 레이아웃, 좌측에 텍스트, 우측에 이미지가 배치된 포맷입니다. 제목이 크게 표시되며 인용구와 태그라인이 포함됩니다.",
  "2": "세 부분으로 분할된 레이아웃으로 메인 이미지, 텍스트 블록, 작은 이미지 두 개가 포함됩니다. 여행 느낌을 표현하기 적합합니다.",
  "3": "좌우 분할 레이아웃으로 좌측에 텍스트 콘텐츠, 우측에 큰 이미지가 배치됩니다. 서브타이틀과 큰 타이틀이 강조됩니다.",
  "4": "전체 페이지 이미지 레이아웃으로 한 장의 이미지가 전체를 차지합니다. 인상적인 사진을 위한 템플릿입니다.",
  "5": "텍스트 중심 레이아웃으로 제목, 부제목, 그리고 하단에 텍스트가 배치됩니다. 여행 후기나 에세이에 적합합니다.",
  "6": "격자 레이아웃으로 여러 이미지와 텍스트가 배치됩니다. 다양한 순간을 보여주기 좋습니다.",
  "7": "사진 에세이 스타일로 이미지와 텍스트가 번갈아 배치됩니다. 사진과 함께 이야기를 전달하기 좋습니다.",
  "8": "잡지 스타일 레이아웃으로 다양한 크기의 텍스트와 이미지가 배치됩니다. 프로페셔널한 느낌을 줍니다.",
  "9": "미니멀한 디자인으로 텍스트와 이미지에 여백이 많습니다. 세련된 여행 기록에 적합합니다.",
  "10": "타임라인 스타일로 여행 일정을 시간 순서대로 보여줍니다. 여행 전체 과정을 표현하기 좋습니다.",
  "11": "컬렉션 스타일로 여러 작은 이미지가 모자이크처럼 배치됩니다. 다양한 순간을 한눈에 보여주기 좋습니다.",
  "12": "심플한 헤더와 본문 구성으로 읽기 쉬운 레이아웃입니다. 텍스트 중심의 여행기에 적합합니다.",
  "13": "세로 스크롤 방식의 스토리텔링 레이아웃입니다. 순차적으로 이야기를 전개하기 좋습니다.",
  "14": "포스터 스타일로 큰 이미지와 선명한 텍스트가 특징입니다. 임팩트 있는 표현에 적합합니다.",
  "15": "미니멀한 갤러리 형식으로 이미지가 주를 이루며 설명 텍스트가 간결하게 배치됩니다. 사진 중심의 여행기에 적합합니다.",
}

export default function TemplatePreview() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // PDF 생성 함수
  const generatePDF = async () => {
    setGeneratingPDF(true);
    
    try {
      const templateElement = document.getElementById('template-content');
      
      // HTML 요소를 캔버스로 변환
      const canvas = await html2canvas(templateElement, {
        scale: 2, // 해상도를 높이기 위한 스케일 설정
        useCORS: true, // 외부 이미지 허용
        logging: false,
        backgroundColor: "#fff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 크기로 PDF 생성 (210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // PDF 파일명 설정
      const fileName = `템플릿_${templateId}_미리보기.pdf`;
      
      // PDF 다운로드
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // 이전 페이지로 돌아가기
  const goBack = () => {
    navigate(-1);
  };

  // 다른 템플릿 보기
  const viewOtherTemplate = (id) => {
    navigate(`/template-preview/${id}`);
  };

  // 선택된 템플릿의 이미지와 설명
  const templateImage = TemplateImages[templateId];
  const templateDescription = TemplateDescriptions[templateId];

  return (
    <div className="template-preview-page">
      <div className="preview-header">
        <h1>템플릿 {templateId} 미리보기</h1>
        <div className="preview-actions">
          <button className="back-button" onClick={goBack}>
            뒤로 가기
          </button>
          <button 
            className="pdf-button" 
            onClick={generatePDF} 
            disabled={generatingPDF}
          >
            {generatingPDF ? "PDF 생성 중..." : "PDF로 저장"}
          </button>
        </div>
      </div>
      
      <div className="template-navigation">
        <div className="nav-label">다른 템플릿 보기:</div>
        <div className="nav-buttons">
          {Array.from({ length: 15 }, (_, i) => i + 1).map(id => (
            <button
              key={id}
              className={`nav-btn ${id === parseInt(templateId) ? 'active' : ''}`}
              onClick={() => viewOtherTemplate(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      
      <div className="template-content-wrapper">
        <div className="template-info">
          <h2>템플릿 {templateId} 설명</h2>
          <p>{templateDescription}</p>
        </div>
        
        <div id="template-content" className="template-content">
          {templateImage ? (
            <img 
              src={templateImage} 
              alt={`템플릿 ${templateId}`} 
              className="template-image"
            />
          ) : (
            <div className="template-error">
              <h3>템플릿을 찾을 수 없습니다</h3>
              <p>선택한 템플릿이 존재하지 않거나 로드할 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 