import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/CommunityList.css";
import { fetchArticles } from "../api/community";

function CommunityList() {
  const location = useLocation();
  const [tab, setTab] = useState("latest");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentUser] = useState('홍길동'); // 실제 로그인 사용자로 교체 필요

  useEffect(() => {
    fetchArticles().then(rawArticles => {
      const mapped = rawArticles.map(art => ({
        id: art.articleID,
        title: art.articleTitle,
        author: art.articleAuthor,
        thumbnail: art.imageURL,
        region: art.travelCountry || art.travelCity || "",
        date: art.createdAt ? art.createdAt.split('T')[0] : "",
        likes: art.likes || 0,
        comments: art.commentCount || 0,
        views: art.view_count || 0
      }));
      setArticles(mapped);
    });
  }, []);

  useEffect(() => {
    if (location.state?.fromMap && location.state?.searchTerm) {
      setRegion(location.state.searchTerm);
    }
  }, [location.state]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // 탭별 정렬/필터링
  let filtered = articles;
  if (tab === 'latest') {
    filtered = [...articles].sort((a, b) => (b.date > a.date ? 1 : -1));
  } else if (tab === 'popular') {
    filtered = [...articles].sort((a, b) => b.likes - a.likes);
  } else if (tab === 'my') {
    filtered = articles.filter(art => art.author === currentUser);
  }
  // 검색/필터링 추가 적용
  filtered = filtered.filter(
    art =>
      (region === "" || art.region.includes(region)) &&
      (search === "" || art.title.includes(search) || (art.summary || '').includes(search))
  );

  return (
    <div className="community-list-page">
      <div className="community-list-header-row">
        <h1>커뮤니티</h1>
        <p>나의 매거진을 공유해보세요</p>
      </div>
      <div className="community-list-container">
        <div className="community-list-header">
          <div className="community-tabs">
            <button className={tab === "latest" ? "active" : ""} onClick={() => setTab("latest")}>최신글</button>
            <button className={tab === "popular" ? "active" : ""} onClick={() => setTab("popular")}>인기글</button>
            <button className={tab === "my" ? "active" : ""} onClick={() => setTab("my")}>내 글</button>
          </div>
          <Link to="/community/write" className="write-btn">＋ 글쓰기</Link>
        </div>
        <div className="community-search-bar">
          <input
            type="text"
            placeholder="지역/장소 검색"
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="community-search-input"
          />
          <input
            type="text"
            placeholder="제목/내용 검색"
            value={search}
            onChange={handleSearch}
            className="community-search-input"
          />
          <button className="community-search-btn">검색</button>
        </div>
        <div className="community-list-grid">
          {filtered.length > 0 ? filtered.map(art => (
            <Link to={`/community/${art.id}`} className="community-card" key={art.id}>
              {art.thumbnail && <img src={art.thumbnail} alt="썸네일" className="community-thumb" />}
              <div className="community-card-body">
                <div className="community-title">{art.title}</div>
                {/* <div className="community-summary">{art.summary}</div> */}
                <div className="community-meta">
                  <span className="community-author">{art.author}</span>
                  <span className="community-date">{art.date}</span>
                  <span className="community-likes">❤️ {art.likes}</span>
                  <span className="community-comments">💬 {art.comments}</span>
                  <span className="community-views">👁 {art.views}</span>
                  <span className="community-region">📍 {art.region}</span>
                </div>
              </div>
            </Link>
          )) : <div className="community-empty">등록된 글이 없습니다.</div>}
        </div>
      </div>
    </div>
  );
}

export default CommunityList;
