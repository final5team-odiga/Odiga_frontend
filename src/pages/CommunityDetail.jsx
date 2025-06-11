import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CommunityDetail.css";
import { fetchArticleDetail, createComment, deleteComment, toggleLike, fetchArticles } from "../api/community";

function CommunityDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [currentUser] = useState("홍길동");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);
  
  // 수정 모드 관련 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [editRegion, setEditRegion] = useState("");

  // 아이콘 경로
  const ICON_HEART = process.env.PUBLIC_URL + "/images/heart.svg";
  const ICON_HEART_RED = process.env.PUBLIC_URL + "/images/heart-red.svg";
  const ICON_EYE = process.env.PUBLIC_URL + "/images/eye.svg";
  const ICON_REPLY = process.env.PUBLIC_URL + "/images/reply.svg";

  // 백엔드 응답을 프론트에서 사용하는 필드명으로 변환하는 매핑 함수
  const mapArticleData = (data) => ({
    id: data.articleID,
    title: data.articleTitle,
    author: data.articleAuthor,
    content: data.content,
    images: data.imageURL ? [data.imageURL] : [],
    region: data.travelCity || data.travelCountry || '',
    date: data.createdAt ? data.createdAt.split('T')[0] : '',
    likes: data.likes || 0,
    views: data.view_count || 0,
    userLiked: data.userLiked || false,
    comments: (data.comments || []).map(c => ({
      id: c.commentID,
      author: c.commentAuthor,
      content: c.content,
      date: c.createdAt ? c.createdAt.split('T')[0] : ''
    }))
  });

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleDetail(id);
        setArticle(mapArticleData(data));
        setLiked(data.userLiked || false);

        // 이전/다음 게시글 ID 찾기
        const articles = await fetchArticles();
        const currentIndex = articles.findIndex(art => art.articleID === id);
        if (currentIndex > 0) {
          setPrevId(articles[currentIndex - 1].articleID);
        }
        if (currentIndex < articles.length - 1) {
          setNextId(articles[currentIndex + 1].articleID);
        }
      } catch (error) {
        console.error("게시글 로딩 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      }
    };
    loadArticle();
  }, [id]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClick(e) {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  if (!article) return <div className="community-detail-container">로딩 중...</div>;

  // 좋아요 토글
  const handleLike = async () => {
    try {
      const result = await toggleLike(id);
      setLiked(result.liked);
      if (typeof result.totalLikes === 'number') {
        setArticle(prev => ({
          ...prev,
          likes: result.totalLikes
        }));
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 댓글 작성
  const onCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    try {
      await createComment(id, commentInput);
      // 댓글 목록 새로고침
      const updatedArticle = await fetchArticleDetail(id);
      setArticle(mapArticleData(updatedArticle));
      setCommentInput("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const onDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    
    try {
      await deleteComment(id, commentId);
      // 댓글 목록 새로고침
      const updatedArticle = await fetchArticleDetail(id);
      setArticle(mapArticleData(updatedArticle));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 수정 모드 시작
  const startEditing = () => {
    if (article) {
      setEditTitle(article.title);
      setEditContent(article.content);
      setEditImages([...article.images]);
      setEditRegion(article.region);
      setIsEditing(true);
      setShowMenu(false);
    }
  };

  // 이미지 삭제
  const removeImage = (index) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  // 새 이미지 추가
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setNewImages(prev => [...prev, ...newImageUrls]);
  };

  // 수정 취소
  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditImages([]);
    setNewImages([]);
    setEditRegion("");
  };

  // 수정 저장
  const saveEdit = () => {
    if (!editTitle.trim() || !editContent.trim() || !editRegion.trim()) {
      alert("제목, 내용, 지역을 모두 입력해주세요.");
      return;
    }

    setArticle(prev => ({
      ...prev,
      title: editTitle,
      content: editContent,
      images: [...editImages, ...newImages],
      region: editRegion,
      date: new Date().toLocaleDateString()
    }));

    setIsEditing(false);
    setNewImages([]);
  };

  // 수정/삭제/공유 핸들러 수정
  const onEdit = () => { 
    setShowMenu(false); 
    startEditing();
  };

  // 수정/삭제/공유(더미)
  const isAuthor = article.author === currentUser;
  const onDelete = () => { setShowMenu(false); window.confirm("정말 삭제하시겠습니까?") && alert("삭제 기능(추후 구현)"); };
  const onShare = () => { setShowMenu(false); navigator.clipboard.writeText(window.location.href).then(() => alert("링크가 복사되었습니다!")); };

  // 이미지 넘기기
  const hasManyImages = article.images.length > 1;
  const prevImg = () => setImgIdx(idx => (idx === 0 ? article.images.length - 1 : idx - 1));
  const nextImg = () => setImgIdx(idx => (idx === article.images.length - 1 ? 0 : idx + 1));

  // 게시물 이동
  const goPrev = () => prevId && navigate(`/community/${prevId}`);
  const goNext = () => nextId && navigate(`/community/${nextId}`);

  return (
    <div style={{position: 'relative'}}>
      {/* 상자 밖 네비게이션 버튼 */}
      <div className="detail-nav-btns-outer">
        <button className="detail-nav-btn prev" onClick={goPrev} disabled={!prevId}>
          <img src={process.env.PUBLIC_URL + '/images/next.svg'} alt="이전 글" className="nav-arrow-icon" style={{transform: 'scaleX(-1)'}} />
        </button>
        <button className="detail-nav-btn next" onClick={goNext} disabled={!nextId}>
          <img src={process.env.PUBLIC_URL + '/images/next.svg'} alt="다음 글" className="nav-arrow-icon" />
        </button>
      </div>
      <div className="community-detail-container">
        {/* 상단 바 */}
        <div className="community-detail-top-bar">
          <div className="topbar-left">
            {article.authorAvatar ? (
              <img src={article.authorAvatar} alt="프로필" className="author-avatar" />
            ) : (
              <div className="author-avatar" style={{background:'#ccc',width:'40px',height:'40px',borderRadius:'50%'}} />
            )}
            <span className="author-name">{article.author}</span>
            <span className="region">{article.region}</span>
          </div>
          <div className="topbar-right">
            {isAuthor && (
              <div className="more-menu-wrap" ref={menuRef}>
                <button className="more-btn" onClick={() => setShowMenu(v => !v)} aria-label="더보기">⋯</button>
                {showMenu && (
                  <div className="more-menu">
                    <button onClick={onEdit}>수정</button>
                    <button onClick={onDelete}>삭제</button>
                    <button onClick={onShare}>공유</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* 수정 모드일 때의 UI */}
        {isEditing ? (
          <>
            <div className="edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="edit-title-input"
              />
              <input
                type="text"
                value={editRegion}
                onChange={(e) => setEditRegion(e.target.value)}
                placeholder="지역을 입력하세요"
                className="edit-region-input"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="edit-content-input"
                rows={10}
              />
              
              {/* 이미지 관리 */}
              <div className="edit-images">
                <h3>이미지 관리</h3>
                <div className="image-list">
                  {editImages.map((img, index) => (
                    <div key={index} className="image-item">
                      <img src={img} alt={`이미지 ${index + 1}`} />
                      <button onClick={() => removeImage(index)} className="remove-image">×</button>
                    </div>
                  ))}
                  {newImages.map((img, index) => (
                    <div key={`new-${index}`} className="image-item">
                      <img src={img} alt={`새 이미지 ${index + 1}`} />
                      <button onClick={() => setNewImages(prev => prev.filter((_, i) => i !== index))} className="remove-image">×</button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="image-upload-input"
                />
              </div>

              <div className="edit-buttons">
                <button onClick={saveEdit} className="save-btn">저장</button>
                <button onClick={cancelEdit} className="cancel-btn">취소</button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 기존 상세 보기 UI */}
            <div className="community-detail-thumb-wrap">
              {hasManyImages && (
                <button className="img-nav prev" onClick={prevImg} aria-label="이전 이미지">&#60;</button>
              )}
              <img src={article.images[imgIdx]} alt="썸네일" className="community-detail-thumb" />
              {hasManyImages && (
                <button className="img-nav next" onClick={nextImg} aria-label="다음 이미지">&#62;</button>
              )}
            </div>
            <hr className="community-detail-divider" />
            <div className="community-detail-title-row">
              <h1 className="community-detail-title">{article.title}</h1>
              <span className="date">{article.date}</span>
            </div>
            <div className="community-detail-content">{article.content}</div>
          </>
        )}
        {/* 댓글/조회수/좋아요(하트) 아이콘 영역 */}
        <div className="community-detail-stats">
          <div className="stats-right">
            <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
              <img src={liked ? ICON_HEART_RED : ICON_HEART} alt="좋아요" className="like-icon" />
              <span className="stats-num">{article.likes + (liked ? 1 : 0)}</span>
            </button>
            <span className="view-count">
              <img src={ICON_EYE} alt="조회수" className="stats-icon" />
              <span className="stats-num">{article.views}</span>
            </span>
          </div>
        </div>
        {/* 댓글 리스트 */}
        <div className="community-detail-comments">
          <h2>댓글 {article.comments.length}</h2>
          <ul>
            {article.comments.map(c => (
              <li key={c.id} className="comment-item">
                <div>
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-date">{c.date}</span>
                  {c.author === currentUser && (
                    <button className="comment-delete" onClick={() => onDeleteComment(c.id)}>삭제</button>
                  )}
                </div>
                <div className="comment-content">{c.content}</div>
              </li>
            ))}
          </ul>
          {/* 댓글 작성 폼 */}
          <form className="comment-form" onSubmit={onCommentSubmit}>
            <textarea
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows={3}
              required
            />
            <div className="comment-form-btns">
              <button type="submit">댓글 달기</button>
              <Link to="/community" className="community-detail-back">목록으로</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetail;
