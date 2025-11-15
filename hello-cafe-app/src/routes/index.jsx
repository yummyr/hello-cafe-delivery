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
import {  UserDashboard, UserOrders, AddressBookPage } from "@/views/user";
import MenuItemForm from "../views/admin/components/MenuItemForm";
import UserMenuPage from '../views/user/pages/UserMenuPage';
import ShoppingCartPage from '../views/user/pages/ShoppingCartPage';
import CheckoutPage from '../views/user/pages/CheckoutPage';
import UserComboPage from '../views/user/pages/UserComboPage';
import FavoritesPage from '../views/user/pages/FavoritesPage';
import NewMenuPage from '../views/user/pages/NewMenuPage';

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
        <Route path="combo" element={<ComboPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="menu/new" element={<MenuItemForm />} />
        <Route path="menu/edit/:id" element={<MenuItemForm />} />
      </Route>
      {/* User Routes */}
      <Route path="/user" >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="addresses" element={<AddressBookPage />} />
        <Route path="menu" element={<UserMenuPage />} />
        <Route path="combos" element={<UserComboPage />} />
        <Route path="new-menu" element={<NewMenuPage />} />
        <Route path="cart" element={<ShoppingCartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
