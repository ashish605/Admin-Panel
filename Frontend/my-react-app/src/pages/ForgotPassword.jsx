import React, { useState } from "react";
import axios from "../api/axiosClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [notif, setNotif] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      setNotif({ type: "success", msg: res.data.message });
    } catch (err) {
      setNotif({
        type: "error",
        msg: err?.response?.data?.message || "Something went wrong"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white  p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {notif && (
          <p
            className={`p-2 rounded mb-3 ${
              notif.type === "error"
                ? "bg-red-200 text-red-700"
                : "bg-green-200 text-green-700"
            }`}
          >
            {notif.msg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="border p-2 w-full rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white w-full p-2 rounded">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
