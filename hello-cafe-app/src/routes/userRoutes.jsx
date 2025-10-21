import { Route } from "react-router-dom";
import { UserLayout, UserDashboard, UserOrders } from "@/views/user";

export const UserRoutes = (
  <Route path="/user" element={<UserLayout />}>
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="orders" element={<UserOrders />} />
  </Route>
);

export default UserRoutes;