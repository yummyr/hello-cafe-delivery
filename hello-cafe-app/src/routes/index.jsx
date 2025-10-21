import { Routes, Route } from "react-router-dom";
import HomePage from "@/views/HomePage";
import LoginPage from "@/views/auth/LoginPage";
import RegisterPage from "@/views/auth/RegisterPage";
import {
  AdminDashboard,
  EmployeePage,
  AnalyticsPage,
  MenuPage,
  OrderPage,
  OrderDetails,
  ComboPage,
  CategoriesPage,
} from "@/views/admin";
import { UserLayout, UserDashboard, UserOrders } from "@/views/user";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/employees" element={<EmployeePage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
      <Route path="/admin/orders" element={<OrderPage />} />
      <Route path="/admin/orders/:id" element={<OrderDetails />} />
      <Route path="/admin/menu" element={<MenuPage />} />
      <Route path="/admin/combos" element={<ComboPage />} />
      <Route path="/admin/categories" element={<CategoriesPage />} />

      {/* User Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="orders" element={<UserOrders />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;