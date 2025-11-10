import React, { useState, useEffect } from "react";
import {
  Filter,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";
import { formatDateTime } from "../../../utils/date";
import Pagination from "../components/Pagination";

function OrdersPage() {
  const tdAndThStyle = "py-3 px-4 text-center";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    toBeConfirmed: 0,
    confirmed: 0,
    deliveryInProgress: 0,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchBeginTime, setSearchBeginTime] = useState("");
  const [searchEndTime, setSearchEndTime] = useState("");
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const urlStatus = searchParams.get('searchStatus');
    const urlPage = searchParams.get('page');
    const urlPageSize = searchParams.get('pageSize');
    
    if (urlStatus) {
      setSearchStatus(urlStatus);
    }
    if (urlPage) {
      setPage(parseInt(urlPage));
    }
    if (urlPageSize) {
      setPageSize(parseInt(urlPageSize));
    }
  }, [location.search]);
  
  // Fetch orders and statistics
  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      setLoading(true);
      const params = {
        page: page,
        pageSize: pageSize,
      };

      if (searchNumber && searchNumber.trim() !== "") {
        params.number = searchNumber;
      }
      if (searchPhone && searchPhone.trim() !== "") {
        params.phone = searchPhone;
      }
      if (searchStatus && searchStatus.trim() !== "") {
        params.status = searchStatus;
      }
      if (searchBeginTime && searchBeginTime.trim() !== "") {
        params.beginTime = searchBeginTime;
      }
      if (searchEndTime && searchEndTime.trim() !== "") {
        params.endTime = searchEndTime;
      }
      const response = await api.get("/admin/orders/conditionSearch", {
        params,
      });
      if (response.data.code === 1 && response.data.data) {
        console.log("Orders fetched successfully with search conditions：", response.data.data);

        setOrders(response.data.data.records || []);
        setTotal(response.data.data.total || 0);
      } else {
        setOrders([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [
    page,
    pageSize,
    searchNumber,
    searchPhone,
    searchStatus,
    searchBeginTime,
    searchEndTime,
  ]);

  const handleStatusChange = (status) => {
    setSearchStatus(status.toString());
    setPage(1);
    setSearchBeginTime("");
    setSearchEndTime("");
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get("/admin/orders/statistics");
      if (response.data.code === 1 && response.data.data) {
        setStatistics(response.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch statistics:", err);
    }
  };
 
  const getStatusText = (status) => {
    const statusMap = {
      1: "Pending Payment",
      2: "Awaiting Acceptance",
      3: "Accepted",
      4: "Delivering",
      5: "Completed",
      6: "Canceled",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusColor = (status) => {
    const colorMap = {
      1: "text-yellow-600 bg-yellow-100",
      2: "text-blue-600 bg-blue-100",
      3: "text-purple-600 bg-purple-100",
      4: "text-green-600 bg-green-100",
      5: "text-gray-600 bg-gray-100",
      6: "text-red-600 bg-red-100",
    };
    return colorMap[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2
            onClick={() => handleStatusChange("")}
            className="text-2xl font-bold text-[#4b3b2b] cursor-pointer hover:text-[#eba762] transition"
          >
            Orders Overview
          </h2>
          {/* Date Range Selector */}
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="dateTime-local"
                value={searchBeginTime}
                onChange={(e) => setSearchBeginTime(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="dateTime-local"
                value={searchEndTime}
                onChange={(e) => setSearchEndTime(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
              />
            </div>
          </div>
        </div>

        <div className="py-4  ">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <p className="w-fit bg-[#b08968] text-white px-4 py-2 rounded-lg  flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </p>
            <input
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              type="text"
              placeholder="Search by Order Number"
              className="px-2 mx-2 rounded-md bg-white placeholder-slate-400 border-2 border-[#b08968] text-center h-10 flex-1 min-w-[200px]"
            />

            <input
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              type="text"
              placeholder="Search by Phone Number"
              className="px-2 mx-2 rounded-md  bg-white placeholder-slate-400 border-2 border-[#b08968] text-center h-10 flex-1 min-w-[200px]"
            />
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => handleStatusChange(2)}
            className="bg-white shadow rounded-lg p-6  cursor-pointer hover:bg-[#e0c3a5] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Confirmation</p>
                <p className="text-2xl text-center font-bold text-yellow-600">
                  {statistics.toBeConfirmed}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div
            onClick={() => handleStatusChange(3)}
            className="bg-white shadow rounded-lg p-6  cursor-pointer hover:bg-[#e0c3a5] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl text-center font-bold text-blue-600">
                  {statistics.confirmed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div
            onClick={() => handleStatusChange(4)}
            className="bg-white shadow rounded-lg p-6  cursor-pointer hover:bg-[#e0c3a5] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Delivery</p>
                <p className="text-2xl text-center font-bold text-green-600">
                  {statistics.deliveryInProgress}
                </p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f2e7da]">
              <tr>
                <th className={tdAndThStyle}>Order ID</th>
                <th className={tdAndThStyle}>Order Number</th>
                <th className={tdAndThStyle}>Customer</th>
                <th className={tdAndThStyle}>Phone</th>
                <th className={tdAndThStyle}>Amount</th>
                <th className={tdAndThStyle}>Order Time</th>
                <th className={tdAndThStyle}>Status</th>
                <th className={tdAndThStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b08968]"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className={tdAndThStyle}>{order.id}</td>
                    <td className="p-3 text-center font-mono text-sm">
                      {order.number}
                    </td>
                    <td className={tdAndThStyle}>{order.userName}</td>
                    <td className={tdAndThStyle}>{order.phone}</td>
                    <td className="p-3 text-center font-semibold text-[#b08968]">
                      ${order.amount}
                    </td>
                    <td className="p-3 text-center text-sm">
                      {formatDateTime(order.orderTime)}
                    </td>
                    <td className={tdAndThStyle}>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className={tdAndThStyle}>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            navigate(`/admin/orders/details/${order.id}`)
                          }
                          className="text-[#b08968] hover:text-[#8d6e52] ml-2"
                          title="View Details"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={total}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={(p) => {
            setPage(p);
            fetchOrders(p, pageSize);
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1, size); // reset to first page
          }}
          showInfo={true}
        />
      </div>
    </AdminLayout>
  );
}

export default OrdersPage;
