import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Lottie from "lottie-react";
import magazineAnimation from "../animation/megazine-anime.json";

// 모바일 여부 판별 커스텀 훅
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function Home() {
  const lottieRef = useRef();
  const animDivRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile && animDivRef.current && lottieRef.current) {
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              lottieRef.current.setSpeed(1);
              lottieRef.current.playSegments([0, 19], true);
            } else {
              lottieRef.current.goToAndStop(0, true);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(animDivRef.current);
      return () => observer.disconnect();
    }
  }, [isMobile]);

  useEffect(() => {
    if (lottieRef.current) {
      const anim = lottieRef.current;
      setTimeout(() => {
        if (anim) {
          const frames = anim.getDuration(true);
          setTotalFrames(frames);
          anim.goToAndStop(0, true);
        }
      }, 100);
    }
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile && lottieRef.current && !isHovered) {
      setIsLeaving(false);
      setIsHovered(true);
      lottieRef.current.setSpeed(1);
      lottieRef.current.playSegments([0, 19], true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile && lottieRef.current && isHovered && !isLeaving) {
      setIsLeaving(true);
      lottieRef.current.setSpeed(1.5);
      lottieRef.current.playSegments([19, 0], true);
    }
  };
  
  const handleAnimationComplete = () => {
    if (isLeaving) {
      setIsHovered(false);
      setIsLeaving(false);
    }
  };

  // 모바일 전용 구조
  if (isMobile) {
    return (
      <div className="home-bg">
        <div className="home-main" style={{flexDirection:'column', gap:'20px', alignItems:'flex-start'}}>
          {/* 1. 챗봇 캐릭터/버튼 */}
          <div className="home-chatbot-center" style={{width:'100%', minHeight:'120px', margin:'18px 0 0 0', display:'flex', flexDirection:'column', right:'-8%'}}>
            {/* 말풍선 크게 */}
            <div className="home-chatbot-bubble" style={{width:'220px', height:'140px', fontSize:'15px', marginBottom:'14px', padding:'16px 32px 24px 42px', textAlign:'center', marginLeft:'-200px'}}>
              안녕하세요.<br/>저는 여행기록 도우미 오디에요.<br/>오늘 여행은 어땠는지 알려주실래요?
            </div>
            {/* 캐릭터+버튼 가로 배치 */}
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'18px'}}>
              <img src="/images/odi-hi.svg" className="home-chatbot-character" alt="챗봇 캐릭터" style={{width:'300px', height:'300px', marginBottom:'0'}} />
              <div className="home-chatbot-action" style={{marginTop:'0'}}>
                <Link to="/travel-record" className="home-chatbot-action-text" style={{fontSize:'1.5rem', display:'inline-block'}}>대화하기<br/>&nbsp;&nbsp;→</Link>
              </div>
            </div>
            <img src="/images/shadow.png" className="home-chatbot-shadow" alt="그림자" style={{width:'240px', height:'20px', margin:'-40px 0 0 -90px'}} />
          </div>
          {/* 2. 여행 매거진 만들기 */}
          <div className="section-title" style={{marginTop:'18px', alignSelf:'center'}}>여행 매거진 만들기 <img src={process.env.PUBLIC_URL + '/images/click.svg'} alt="클릭 유도" className="click-indicator-inline" /></div>
          <Link to="/create-magazine" className="magazine-link" style={{alignSelf:'center'}}>
            <div className="magazine-animation" ref={animDivRef} style={{marginBottom:'18px'}}>
              <Lottie lottieRef={lottieRef} animationData={magazineAnimation} loop={false} autoplay={false} rendererSettings={{preserveAspectRatio: 'xMidYMid slice', progressiveLoad: false}} />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // PC용 기존 구조
  return (
    <div className="home-bg">
      <div className="home-main">
        <div className="home-left">
          <div className="section-title">여행 매거진 만들기 
            <img 
              src={process.env.PUBLIC_URL + '/images/click.svg'} 
              alt="클릭 유도" 
              className="click-indicator-inline" 
            />
          </div>
          <Link to="/create-magazine" className="magazine-link">
            <div 
              className="magazine-animation"
              ref={animDivRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{position: 'relative'}}
            >
              <Lottie 
                lottieRef={lottieRef}
                animationData={magazineAnimation} 
                loop={false} 
                autoplay={false}
                onComplete={handleAnimationComplete}
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid slice',
                  progressiveLoad: false
                }}
              />
            </div>
          </Link>
        </div>
        <div className="home-right">
          <div className="note-center">
            <div className="weather-area">
              <div className="weather-section">
                <div className="weather-row">
                  <span className="weather-label">날씨 :</span>
                  <img src="/images/sun.svg" className="weather-icon" alt="맑음" />
                  <img src="/images/wind.svg" className="weather-icon" alt="바람" />
                  <img src="/images/rain.svg" className="weather-icon" alt="비" />
                  <img src="/images/snow.svg" className="weather-icon" alt="눈" />
                </div>
                <div className="temperature-row">
                  <span className="temperature-label">기온 :</span>
                  <span className="temperature-value">36.5º</span>
                </div>
                <div className="emotion-row">
                  <span className="emotion-label">기분 :</span>
                  <div className="emotion-icons-container">
                    <img src="/images/smile.svg" className="emotion-icon" alt="웃음" />
                    <img src="/images/soso.svg" className="emotion-icon" alt="보통" />
                    <img src="/images/sad.svg" className="emotion-icon" alt="슬픔" />
                    <img src="/images/angry.svg" className="emotion-icon" alt="화남" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-chatbot-center">
            <div className="home-chatbot-area">
              <div className="home-chatbot-bubble">
                &nbsp; &nbsp;안녕하세요.<br/>
                &nbsp; &nbsp;저는 여행기록 도우미 오디에요.<br/>
                &nbsp; &nbsp;오늘 여행은 어땠는지 알려주실래요?
              </div>

              <img src="/images/odi-hi.svg" className="home-chatbot-character" alt="챗봇 캐릭터" />
              <img src="/images/shadow.png" className="home-chatbot-shadow" alt="그림자" />
              <div className="home-chatbot-action">
                <Link to="/travel-record" className="home-chatbot-action-text">
                  대화하기&nbsp;&nbsp; <br/> →&nbsp;&nbsp;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 