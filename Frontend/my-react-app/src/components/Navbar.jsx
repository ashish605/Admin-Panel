import React from "react";
import {jwtDecode} from "jwt-decode";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-end items-center">
      <span className="font-semibold text-gray-700">{decoded.name}</span>
      <span className="ml-2 px-3 py-1 bg-blue-900 text-white rounded-xl text-sm">
        {decoded.role}
      </span>
    </div>
  );
};

export default Navbar;
