import axiosInstance from "./axiosInstance";

// 게시글 목록 조회
export const fetchArticles = async () => {
  const res = await axiosInstance.get("/articles/");
  return res.data.articles;
};

// 게시글 상세 조회
export const fetchArticleDetail = async (id) => {
  const res = await axiosInstance.get(`/articles/${id}`);
  return res.data.article;
};

// 댓글 작성
export const createComment = async (articleId, content) => {
  const formData = new FormData();
  formData.append("content", content);
  const res = await axiosInstance.post(`/articles/${articleId}/comments/`, formData);
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (articleId, commentId) => {
  const res = await axiosInstance.delete(`/articles/${articleId}/comments/${commentId}`);
  return res.data;
};

// 좋아요 토글
export const toggleLike = async (articleId) => {
  const res = await axiosInstance.post(`/articles/${articleId}/like/`);
  return res.data;
}; 