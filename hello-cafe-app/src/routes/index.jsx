import { Routes, Route } from "react-router-dom";
import HomePage from "@/views/HomePage";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth / Admin / User routes */}
      <AdminRoutes />
      <AuthRoutes />
      <UserRoutes />

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
