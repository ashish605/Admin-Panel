//for cards styling used in dashboard
import React from "react";
export const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow ${className}`}>{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold mb-2">{children}</h2>
);

export const CardContent = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);
