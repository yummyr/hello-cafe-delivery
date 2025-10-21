import { Route } from "react-router-dom";
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

const AdminRoutes = (
  <>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/employees" element={<EmployeePage />} />
    <Route path="/admin/analytics" element={<AnalyticsPage />} />
    <Route path="/admin/orders" element={<OrderPage />} />
    <Route path="/admin/orders/:id" element={<OrderDetails />} />
    <Route path="/admin/menu" element={<MenuPage />} />
    <Route path="/admin/combos" element={<ComboPage />} />
    <Route path="/admin/categories" element={<CategoriesPage />} />
  </>
);

export default AdminRoutes;