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
import { UserLayout, UserDashboard, UserOrders, AddressBookPage } from "@/views/user";
import MenuItemForm from "../views/admin/components/MenuItemForm";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin">
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="orders/details/:id" element={<OrderDetails />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="combos" element={<ComboPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="menu/new" element={<MenuItemForm />} />
        <Route path="menu/edit/:id" element={<MenuItemForm />} />
      </Route>
      {/* User Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="addresses" element={<AddressBookPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
