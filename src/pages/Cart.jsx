import React, { useState } from "react";
import "../styles/Cart.css";

export default function Cart() {
  // 더미 장바구니 데이터 (메거진 상품만)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "여행 매거진 2024 봄호", image: "https://via.placeholder.com/60x80", price: 12000, quantity: 1 },
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="Cart-container">
      <h1 className="Cart-title">장바구니</h1>
      <div className="Cart-list">
        {cartItems.map(item => (
          <div key={item.id} className="Cart-item">
            {item.image ? (
              <img src={item.image} alt="매거진 이미지" className="Cart-image" />
            ) : (
              <span className="Cart-image Cart-noimg"></span>
            )}
            <span className="Cart-name">{item.name}</span>
            <span className="Cart-price">{item.price.toLocaleString()}원</span>
            <div className="Cart-quantity">
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <button className="Cart-remove-btn" onClick={() => handleRemoveItem(item.id)}>삭제</button>
          </div>
        ))}
      </div>
      <div className="Cart-total">
        <span>총 금액: {totalAmount.toLocaleString()}원</span>
        <button className="Cart-checkout-btn">결제하기</button>
      </div>
    </div>
  );
} 