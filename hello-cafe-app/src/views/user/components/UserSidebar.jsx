import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <aside className="w-64 bg-[#2e2e2e] text-white flex flex-col shadow-lg fixed top-[72px] left-0 bottom-0">
    <p>User Sidebar</p>
    </aside>
  );
}

export default UserSidebar;
;
