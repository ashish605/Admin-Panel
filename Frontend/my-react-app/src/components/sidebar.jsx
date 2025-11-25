import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Users, Shield, LogOut, Menu } from "lucide-react";
import {jwtDecode} from "jwt-decode";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={`bg-blue-900 text-white min-h-screen p-4 transition-all duration-300 
      ${isOpen ? "w-64" : "w-20"} flex flex-col`}>

      <button
        className="mb-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={26} />
      </button>

      {/* Menu Items */}
      <div className="space-y-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3">
          <Home /> {isOpen && "Dashboard"}
        </button>

        <button onClick={() => navigate("/profile")} className="flex items-center gap-3">
          <User /> {isOpen && "Profile"}
        </button>

        {/* Admin */}
        {decoded?.role === "ADMIN" && (
          <button onClick={() => navigate("/admin/users")} className="flex items-center gap-3">
            <Users /> {isOpen && "Manage Users"}
          </button>
        )}
        {decoded?.role === "SUPERADMIN" && (
          <button onClick={() => navigate("/admin/users")} className="flex items-center gap-3">
            <Users /> {isOpen && "Manage Users"}
          </button>
        )}

        {/* SUPERADMIN ONLY */}
        {decoded?.role === "SUPERADMIN" && (
          <button onClick={() => navigate("/admin/admins")} className="flex items-center gap-3">
            <Shield /> {isOpen && "Manage Admins"}
          </button>
        )}
      </div>

      {/* Bottom Logout */}
      <div className="mt-auto fixed bottom-7">
        <button onClick={logout} className="flex items-center gap-3 text-red-400">
          <LogOut /> {isOpen && "Logout"}
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
