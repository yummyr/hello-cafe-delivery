import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [todayStats, setTodayStats] = useState({
    revenue: 0,
    avgOrder: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("admin/analytics");
        setData(res.data.trends);
        setTodayStats(res.data.today);
      } catch (err) {
        console.error("❌ Failed to load analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  
  
  const today = new Date().toLocaleDateString();

  return (
     <AdminLayout >
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#4b3b2b]">Analytics Overview</h2>

      {/* Today's Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Today's Revenue ({today})</h3>
          <p className="text-2xl font-bold mt-2">${todayStats.revenue}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Average Order Value</h3>
          <p className="text-2xl font-bold mt-2">${todayStats.avgOrder}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">{todayStats.totalOrders}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#4b3b2b]">Weekly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#b08968" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </AdminLayout>
  );
}

export default AnalyticsPage;
