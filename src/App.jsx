import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HeaderNav from "./components/HeaderNav.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Agreement from "./pages/Agreement.jsx";
import Login from "./pages/Login.jsx";
import CreateMagazine from "./pages/CreateMagazine.jsx";
import TemplatePreview from "./pages/TemplatePreview.jsx";
import TravelRecord from "./pages/TravelRecord.jsx";
import Mypage from "./pages/Mypage.jsx";
import CommunityList from "./pages/CommunityList.jsx";
import CommunityDetail from "./pages/CommunityDetail.jsx";
import CommunityWrite from "./pages/CommunityWrite.jsx";
import OrderList from "./pages/OrderList.jsx";
import Cart from "./pages/Cart.jsx";
import Inquiry from "./pages/Inquiry.jsx";
import SearchMapPage from "./pages/SearchMapPage.jsx";

function AppContent() {
  const location = useLocation();
  // 로그인, 회원가입, 약관동의 경로에서는 헤더 숨김
  const hideHeader = ["/login", "/signup", "/agreement"].includes(
    location.pathname
  );
  return (
    <div className="App">
      {!hideHeader && <HeaderNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/create-magazine" element={<CreateMagazine />} />
        <Route
          path="/template-preview/:templateId"
          element={<TemplatePreview />}
        />
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
