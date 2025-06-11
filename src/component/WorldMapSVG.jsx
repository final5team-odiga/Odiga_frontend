import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountryPaths from "../data/countryPaths";
import { countryCoordinates } from "../data/countryPaths";
import { countryNames } from '../data/countryNames.jsx';
import axiosInstance from '../api/axiosInstance';

const buttonStyle = {
    background: "#fff",
    border: "1px solid #bbb",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#333",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "background 0.2s, box-shadow 0.2s",
    marginBottom: "0.5em",
};

const Tooltip = ({ x, y, text }) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "500",
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            transform: "translate(-50%, -120%)",
            transition: "all 0.2s ease-out",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)"
        }}
    >
        {text}
    </div>
);

const INIT_VIEWBOX = { x: 0, y: 0, w: 1400, h: 599.107 };

const WorldMapSVG = ({ searchTerm }) => {
    const navigate = useNavigate();
    const [tooltip, setTooltip] = useState(null);
    const timeoutRef = useRef();
    const [viewBox, setViewBox] = useState(INIT_VIEWBOX);
    const [dragging, setDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const viewBoxRef = useRef(INIT_VIEWBOX);
    const [hoveredMarker, setHoveredMarker] = useState(null);
    const [magazineCounts, setMagazineCounts] = useState({});

    // 줌 레벨 제한 상수
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 4;
    const ZOOM_FACTOR = 1.2;

    // 현재 줌 레벨 계산
    const getCurrentZoom = () => {
        return INIT_VIEWBOX.w / viewBoxRef.current.w;
    };

    // 마커 크기 계산
    const getMarkerSize = () => {
        const zoom = getCurrentZoom();
        const baseSize = 18; // 기본 마커 크기
        return Math.max(baseSize / zoom, 5); // 최소 크기는 5로 제한
    };

    // viewBox 상태 업데이트 함수
    const updateViewBox = (newViewBox) => {
        viewBoxRef.current = newViewBox;
        setViewBox(newViewBox);
    };

    // 확대/축소 시 viewBox 조절
    const handleZoomIn = () => {
        if (isZooming) return;
        setIsZooming(true);

        const currentViewBox = viewBoxRef.current;
        const currentZoom = INIT_VIEWBOX.w / currentViewBox.w;
        if (currentZoom >= MAX_ZOOM) {
            setIsZooming(false);
            return;
        }

        const zoomFactor = ZOOM_FACTOR;
        const centerX = currentViewBox.x + currentViewBox.w / 2;
        const centerY = currentViewBox.y + currentViewBox.h / 2;
        const newW = currentViewBox.w / zoomFactor;
        const newH = currentViewBox.h / zoomFactor;

        const newViewBox = {
            x: centerX - newW / 2,
            y: centerY - newH / 2,
            w: newW,
            h: newH,
        };

        updateViewBox(newViewBox);
        setTimeout(() => setIsZooming(false), 100);
    };

    const handleZoomOut = () => {
        if (isZooming) return;
        setIsZooming(true);

        const currentViewBox = viewBoxRef.current;
        const currentZoom = INIT_VIEWBOX.w / currentViewBox.w;
        if (currentZoom <= MIN_ZOOM) {
            setIsZooming(false);
            return;
        }

        const zoomFactor = ZOOM_FACTOR;
        const centerX = currentViewBox.x + currentViewBox.w / 2;
        const centerY = currentViewBox.y + currentViewBox.h / 2;
        const newW = currentViewBox.w * zoomFactor;
        const newH = currentViewBox.h * zoomFactor;

        const newViewBox = {
            x: centerX - newW / 2,
            y: centerY - newH / 2,
            w: newW,
            h: newH,
        };

        updateViewBox(newViewBox);
        setTimeout(() => setIsZooming(false), 100);
    };

    const handleReset = () => {
        updateViewBox(INIT_VIEWBOX);
        setTooltip(null);
    };

    // 드래그 패닝
    const handleMouseDown = (e) => {
        if (isZooming) return;
        setDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!dragging || isZooming) return;

        const currentViewBox = viewBoxRef.current;
        const svg = e.target.ownerSVGElement || e.target;
        const rect = svg.getBoundingClientRect();
        const dx = (e.clientX - lastPos.x) * (currentViewBox.w / rect.width);
        const dy = (e.clientY - lastPos.y) * (currentViewBox.h / rect.height);

        const newViewBox = {
            ...currentViewBox,
            x: currentViewBox.x - dx,
            y: currentViewBox.y - dy,
        };

        updateViewBox(newViewBox);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseOver = (e) => {
        e.target.style.fill = "#3C3B6E";
    };
    const handleMouseOut = (e) => {
        e.target.style.fill = "#88a4bc";
    };
    const handleClick = (e) => {
        const rect = e.target.ownerSVGElement.getBoundingClientRect();
        setTooltip({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setTooltip(null), 2000);
    };

    // 검색어에 해당하는 국가 코드 찾기
    const findCountryBySearch = (search) => {
        if (!search) return null;
        const searchLower = search.toLowerCase();
        
        // 정확한 매칭을 위한 함수
        const isExactMatch = (name) => {
            const nameLower = name.toLowerCase();
            return nameLower === searchLower || nameLower.startsWith(searchLower);
        };

        // 정확한 매칭이 있는지 먼저 확인
        const exactMatch = Object.entries(countryNames).find(([code, name]) => 
            isExactMatch(name)
        );

        if (exactMatch) {
            return exactMatch[0];
        }

        // 정확한 매칭이 없으면 부분 매칭 시도
        return Object.entries(countryNames).find(([code, name]) => 
            name.toLowerCase().includes(searchLower)
        )?.[0];
    };

    // 특정 국가로 확대
    const zoomToCountry = useCallback((countryCode) => {
        const center = countryCoordinates[countryCode];
        if (!center) return;

        const zoomLevel = 4; // 확대 레벨을 2에서 4로 증가
        const newW = INIT_VIEWBOX.w / zoomLevel;
        const newH = INIT_VIEWBOX.h / zoomLevel;

        const newViewBox = {
            x: center.x - newW / 2,
            y: center.y - newH / 2,
            w: newW,
            h: newH,
        };

        updateViewBox(newViewBox);
    }, []);

    // 검색어가 변경될 때마다 해당 국가로 확대
    useEffect(() => {
        if (searchTerm) {
            const countryCode = findCountryBySearch(searchTerm);
            if (countryCode) {
                zoomToCountry(countryCode);
            }
        }
    }, [searchTerm, zoomToCountry]);

    // 마커 클릭 핸들러
    const handleMarkerClick = (countryCode) => {
        const countryName = countryNames[countryCode];
        if (countryName) {
            // 커뮤니티 리스트 페이지로 이동하면서 검색어를 state로 전달
            navigate('/community', { 
                state: { 
                    searchTerm: countryName,
                    fromMap: true 
                }
            });
        }
    };

    // 마커 호버 핸들러 수정
    const handleMarkerMouseOver = (e, countryCode) => {
        const countryName = countryNames[countryCode];
        const rect = e.target.ownerSVGElement.getBoundingClientRect();
        setTooltip({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            text: countryName
        });
        setHoveredMarker(countryCode);
    };

    const handleMarkerMouseOut = () => {
        setTooltip(null);
        setHoveredMarker(null);
    };

    // 한글명 → 코드 매핑 생성
    const nameToCode = {};
    Object.entries(countryNames).forEach(([code, name]) => {
        nameToCode[name] = code;
    });

    // 나라별 매거진 카운트 API 연동 (한글명 → 코드 변환)
    useEffect(() => {
        axiosInstance.get('/analytics/country-counts/')
            .then(res => {
                if (res.data.success) {
                    const counts = {};
                    res.data.data.forEach(item => {
                        const code = nameToCode[item.country];
                        if (code) counts[code] = item.count;
                    });
                    setMagazineCounts(counts);
                }
            });
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
            <svg
                id="worldMap"
                width="100%"
                height="auto"
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                style={{ display: "block", cursor: dragging ? "grabbing" : "grab" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <CountryPaths 
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={handleClick}
                />
                {Object.entries(magazineCounts).map(([code, count]) => {
                    const center = countryCoordinates[code];
                    if (!center) return null;
                    const markerSize = getMarkerSize();
                    const isHovered = hoveredMarker === code;
                    const hoverScale = isHovered ? 1.2 : 1;
                    
                    return (
                        <g 
                            key={code}
                            onClick={() => handleMarkerClick(code)}
                            onMouseOver={(e) => handleMarkerMouseOver(e, code)}
                            onMouseOut={handleMarkerMouseOut}
                            style={{ 
                                cursor: 'pointer',
                                transform: `scale(${hoverScale})`,
                                transformOrigin: `${center.x}px ${center.y}px`,
                                transition: 'transform 0.2s ease-out'
                            }}
                        >
                            <circle 
                                cx={center.x} 
                                cy={center.y} 
                                r={markerSize} 
                                fill={isHovered ? "#ff3b3f" : "#ff5a5f"} 
                                stroke="#fff" 
                                strokeWidth={markerSize/6}
                                style={{
                                    transition: 'fill 0.2s ease-out'
                                }}
                            />
                            <text 
                                x={center.x} 
                                y={center.y + markerSize/3} 
                                textAnchor="middle" 
                                fontSize={markerSize} 
                                fontWeight="bold" 
                                fill="#fff"
                            >
                                {count}
                            </text>
                        </g>
                    );
                })}
            </svg>
            {tooltip && <Tooltip {...tooltip} />}
            <div
                style={{
                    position: "absolute",
                    right: 20,
                    bottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    zIndex: 10,
                }}
            >
                <button style={buttonStyle} onClick={handleZoomIn}>＋ 확대</button>
                <button style={buttonStyle} onClick={handleZoomOut}>－ 축소</button>
                <button style={buttonStyle} onClick={handleReset}>🌍 전체 보기</button>
            </div>
        </div>
    );
};

export default WorldMapSVG; 