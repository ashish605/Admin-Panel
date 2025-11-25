import React from "react";
import {jwtDecode} from "jwt-decode";  
import { Card, CardContent, CardTitle } from "../components/UI";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (err) {
    console.error("Invalid token");
  }

  const name = decoded?.name || "User";
  const role = decoded?.role || "USER";

  const items = [
    { role: ["USER", "ADMIN", "SUPERADMIN"], title: "Profile", link: "/profile" },
    { role: ["ADMIN", "SUPERADMIN"], title: "Manage Users", link: "/admin/users" },
    { role: ["SUPERADMIN"], title: "Manage Admins", link: "/admin/admins" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome, {name} 👋
      </h1>

      <p className="text-gray-600 mb-6">
        Role: <span className="font-semibold">{role}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items
          .filter((item) => item.role.includes(role))
          .map((item, index) => (
            <Link key={index} to={item.link}>
              <Card className="hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-gray-200">
                <CardTitle>{item.title}</CardTitle>
                <CardContent>Click to view details</CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
