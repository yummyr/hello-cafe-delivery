import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("admin/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error("❌ Failed to fetch orders:", err));
  }, []);

  return (
      <AdminLayout >
    <div>
      <h2 className="text-2xl font-bold text-[#4b3b2b] mb-6">Orders Overview</h2>

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-[#f2e7da]">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.customerName}</td>
              <td className="p-3">${o.total}</td>
              <td className="p-3">{o.status}</td>
              <td className="p-3">
                <button
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="text-[#b08968] hover:underline"
                >
                  View Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
}

export default OrdersPage;
