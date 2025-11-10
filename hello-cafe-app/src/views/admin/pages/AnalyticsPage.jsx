import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ begin: "", end: "" });
  const [mainPeriod, setMainPeriod] = useState("7days"); // '1day', '7days', '14days', '30days'

  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [top10Data, setTop10Data] = useState([]);

  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    orderCompletionRate: 0,
  });

  /** =======================
   *   API FUNCTIONS
   * ======================= */

  const getRevenueStatistics = async (begin, end) => {
    const response = await api.get("/admin/report/revenueStatistics", {
      params: { begin, end },
    });
    return response.data;
  };

  const getUserStatistics = async (begin, end) => {
    const response = await api.get("/admin/report/userStatistics", {
      params: { begin, end },
    });
    return response.data;
  };

  const getOrderStatistics = async (begin, end) => {
    const response = await api.get("/admin/report/ordersStatistics", {
      params: { begin, end },
    });
    return response.data;
  };

  const getSalesTop10 = async (begin, end) => {
    const response = await api.get("/admin/report/top10", {
      params: { begin, end },
    });
    return response.data;
  };

  const getMainDateRange = (period) => {
    const end = new Date();
    const begin = new Date();

    switch (period) {
      case "1day":
        begin.setDate(begin.getDate() - 1);
        break;
      case "7days":
        begin.setDate(begin.getDate() - 7);
        break;
      case "14days":
        begin.setDate(begin.getDate() - 14);
        break;
      case "30days":
        begin.setDate(begin.getDate() - 30);
        break;
      default:
        begin.setDate(begin.getDate() - 7);
    }

    return {
      begin: begin.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  /** =======================
   *   DEFAULT DATE RANGE
   * ======================= */
  useEffect(() => {
    const defaultRange = getMainDateRange(mainPeriod);
    setDateRange(defaultRange);
  }, [mainPeriod]);

  /** =======================
   *   FETCH REPORT DATA
   * ======================= */

  useEffect(() => {
    if (dateRange.begin && dateRange.end) {
      fetchAllReports();
    }
  }, [dateRange]);

  useEffect(() => {
    fetchTop10Data();
  }, [mainPeriod]);

  const fetchTop10Data = async () => {
    try {
      const top10DateRange = getMainDateRange(mainPeriod);
      const top10Res = await getSalesTop10(
        top10DateRange.begin,
        top10DateRange.end
      );
  console.log("📊 Top 10 Response:", top10Res);
  console.log("📊 Top 10 Data:", top10Res.data);

      /** Top 10 */
      if (top10Res.code === 1 && top10Res.data) {
        const names = top10Res.data.nameList.split(",");
        const numbers = top10Res.data.numberList.split(",").map(Number);
        const top10ChartData = names.map((name, index) => ({
          name,
          sales: numbers[index] || 0,
        }));
        setTop10Data(top10ChartData);
      }
    } catch (error) {
      console.error("❌ fetch top 10 failed:", error);
    }
  };

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const [revenueRes, userRes, orderRes] = await Promise.all([
        getRevenueStatistics(dateRange.begin, dateRange.end),
        getUserStatistics(dateRange.begin, dateRange.end),
        getOrderStatistics(dateRange.begin, dateRange.end),
      ]);
      console.log("📊 Revenue Response:", revenueRes);
      console.log("📊 User Response:", userRes);
      console.log("📊 Order Response:", orderRes);
      /** Revenue Trend */
      if (revenueRes.code === 1 && revenueRes.data) {
        const dates = revenueRes.data.dateList.split(",");
        const revenues = revenueRes.data.revenueList.split(",").map(Number);
        const revenueChartData = dates.map((date, index) => ({
          date,
          turnover: revenues[index] || 0,
        }));
        setRevenueData(revenueChartData);

        const totalRevenue = revenues.reduce((sum, v) => sum + v, 0);
        setSummaryStats((prev) => ({
          ...prev,
          totalRevenue,
          avgOrderValue:
            totalRevenue / (revenueRes.data.totalOrderCount || 1) || 0,
        }));
      }

      /** User Trend */
      if (userRes.code === 1 && userRes.data) {
        const dates = userRes.data.dateList.split(",");
        const newUsers = userRes.data.newUserList.split(",").map(Number);
        const totalUsers = userRes.data.totalUserList.split(",").map(Number);

        const userChartData = dates.map((date, index) => ({
          date,
          newUsers: newUsers[index] || 0,
          totalUsers: totalUsers[index] || 0,
        }));
        setUserData(userChartData);
      }

      /** Order Statistics */
      if (orderRes.code === 1 && orderRes.data) {
        const dates = orderRes.data.dateList.split(",");
        const orderCounts = orderRes.data.orderCountList.split(",").map(Number);
        const validCounts = orderRes.data.validOrderCountList
          .split(",")
          .map(Number);

        const orderChartData = dates.map((date, index) => ({
          date,
          totalOrders: orderCounts[index] || 0,
          validOrders: validCounts[index] || 0,
        }));
        setOrderData(orderChartData);

        setSummaryStats((prev) => ({
          ...prev,
          totalOrders: orderRes.data.totalOrderCount || 0,
          orderCompletionRate: orderRes.data.orderCompletionRate || 0,
        }));
      }
    } catch (error) {
      console.error("❌ fetch reports failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalTurnover = revenueData.reduce((sum, i) => sum + i.turnover, 0);
  const avgOrderValue =
    summaryStats.totalOrders > 0 ? totalTurnover / summaryStats.totalOrders : 0;

  /** =======================
   *   RENDER
   * ======================= */
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#4b3b2b]">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Revenue, Users, Orders & Sales Insights
            </p>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#4b3b2b] mb-4">
            Select Time Period
          </h3>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMainPeriod("1day")}
              className={`px-4 py-2 text-sm rounded ${
                mainPeriod === "1day"
                  ? "bg-[#b08968] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Recent 1 Day
            </button>
            <button
              onClick={() => setMainPeriod("7days")}
              className={`px-4 py-2 text-sm rounded ${
                mainPeriod === "7days"
                  ? "bg-[#b08968] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Recent 7 Days
            </button>
            <button
              onClick={() => setMainPeriod("14days")}
              className={`px-4 py-2 text-sm rounded ${
                mainPeriod === "14days"
                  ? "bg-[#b08968] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Recent 14 Days
            </button>
            <button
              onClick={() => setMainPeriod("30days")}
              className={`px-4 py-2 text-sm rounded ${
                mainPeriod === "30days"
                  ? "bg-[#b08968] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Recent 30 Days
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Period: {dateRange.begin} → {dateRange.end}
          </p>
        </div>

        {/** LOADING */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b08968]" />
            <p className="mt-2 text-gray-600">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SummaryCard
                title="Total Revenue"
                value={`$${totalTurnover.toFixed(2)}`}
                icon={<DollarSign className="w-8 h-8 text-[#b08968]" />}
              />
              <SummaryCard
                title="Total Orders"
                value={summaryStats.totalOrders}
                icon={<ShoppingCart className="w-8 h-8 text-blue-600" />}
              />
              <SummaryCard
                title="Avg Order Value"
                value={`$${avgOrderValue.toFixed(2)}`}
                icon={<TrendingUp className="w-8 h-8 text-green-600" />}
              />
              <SummaryCard
                title="Completion Rate"
                value={`${(summaryStats.orderCompletionRate ).toFixed(
                  2
                )}%`}
                icon={<Users className="w-8 h-8 text-purple-600" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <ChartCard title="Revenue Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line
                      type="monotone"
                      dataKey="turnover"
                      stroke="#b08968"
                      strokeWidth={2}
                      dot={{ fill: "#b08968" }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* User Statistics */}
              <ChartCard title="User Statistics">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalUsers"
                      stroke="#4b3b2b"
                      strokeWidth={2}
                      dot={{ fill: "#4b3b2b" }}
                      name="Daily Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#4caf50"
                      strokeWidth={2}
                      dot={{ fill: "#4caf50" }}
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Order Statistics */}
              <ChartCard title="Order Statistics">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={orderData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalOrders"
                      stroke="#f5c16c"
                      strokeWidth={2}
                      name="Total Orders"
                    />
                    <Line
                      type="monotone"
                      dataKey="validOrders"
                      stroke="#b08968"
                      strokeWidth={2}
                      name="Valid Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Top 10 Sales */}
              <ChartCard title="Sales Ranking Top 10">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={top10Data}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#b08968" name="Sales Volume" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

/** Helper Components */
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-[#4b3b2b]">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const ChartCard = ({ title, children, extra }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-[#4b3b2b]">{title}</h3>
      {extra && <div>{extra}</div>}
    </div>
    {children}
  </div>
);

export default AnalyticsPage;
