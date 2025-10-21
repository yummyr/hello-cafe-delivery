import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/admin/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error("❌ Failed to fetch order detail:", err));
  }, [id]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#4b3b2b] mb-4">Order #{order.id}</h2>
      <p><strong>Customer:</strong> {order.customerName}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <h3 className="mt-6 font-semibold text-[#4b3b2b]">Items</h3>
      <ul className="list-disc ml-6">
        {order.items.map((item, index) => (
          <li key={index}>{item.name} × {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default OrderDetailPage;
