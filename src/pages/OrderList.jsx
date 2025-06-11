import React from "react";
import "../styles/OrderList.css";

export default function OrderList() {
  // 더미 주문 데이터
  const orders = [
    { id: "ORD-2023-001", date: "2023-10-15", status: "배송완료", amount: 45000, image: "" },
    { id: "ORD-2023-002", date: "2023-10-10", status: "배송중", amount: 32000, image: "" },
    { id: "ORD-2023-003", date: "2023-10-05", status: "결제완료", amount: 78000, image: null },
  ];

  return (
    <div className="OrderList-container">
      <h1 className="OrderList-title">주문 조회</h1>
      <div className="OrderList-table">
        <div className="OrderList-row header">
          <span>주문번호</span>
          <span>이미지</span>
          <span>주문일</span>
          <span>금액</span>
          <span>배송상태</span>
        </div>
        {orders.map(order => (
          <div className="OrderList-row" key={order.id}>
            <span>{order.id}</span>
            <span>
              {order.image ? (
                <img src={order.image} alt="상품 이미지" className="OrderList-image" />
              ) : (
                <span className="OrderList-image OrderList-noimg"></span>
              )}
            </span>
            <span>{order.date}</span>
            <span className="order-amount">{order.amount.toLocaleString()}원</span>
            <span className="order-status">{order.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 