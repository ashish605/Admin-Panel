import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full overflow-auto">
        <Navbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
