import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HeaderNav from './component/HeaderNav';
import ScrollToTop from './component/ScrollToTop';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Agreement from './pages/Agreement';
import Login from './pages/Login';
import CreateMagazine from './pages/CreateMagazine';
import TemplatePreview from './pages/TemplatePreview';
import TravelRecord from './pages/TravelRecord';
import Mypage from './pages/Mypage';
import CommunityList from './pages/CommunityList';
import CommunityDetail from './pages/CommunityDetail';
import CommunityWrite from './pages/CommunityWrite';
import OrderList from './pages/OrderList';
import Cart from './pages/Cart';
import Inquiry from './pages/Inquiry';
import SearchMapPage from './pages/SearchMapPage';

function AppContent() {
  const location = useLocation();
  // 로그인, 회원가입, 약관동의 경로에서는 헤더 숨김
  const hideHeader = ["/login", "/signup", "/agreement"].includes(location.pathname);
  return (
    <div className="App">
      {!hideHeader && <HeaderNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/create-magazine" element={<CreateMagazine />} />
        <Route path="/template-preview/:templateId" element={<TemplatePreview />} />
        <Route path="/travel-record" element={<TravelRecord />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/community" element={<CommunityList />} />
        <Route path="/community/:id" element={<CommunityDetail />} />
        <Route path="/community/write" element={<CommunityWrite />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/search" element={<SearchMapPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;