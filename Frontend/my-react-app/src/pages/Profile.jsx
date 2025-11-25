// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import {jwtDecode} from "jwt-decode";

const Profile = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  // Prefer reading from server on mount to ensure fresh data
  const [name, setName] = useState(decoded?.name || "");
  const [email, setEmail] = useState(decoded?.email || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/user/profile");
        const user = res.data.user;
        if (user) {
          setName(user.name);
          setEmail(user.email);
          // optionally update a local userInfo so other components can read latest
          localStorage.setItem("userInfo", JSON.stringify(user));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put("/user/profile", { name });
      setMessage("Profile updated successfully!");
      // update local userInfo (and optionally re-fetch token on backend if you want)
      const userInfo = { ...(JSON.parse(localStorage.getItem("userInfo") || "{}")), name };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // also if you want to reflect in decoded token name used across UI,
      // you can keep a small userInfo and read that in Dashboard/Sidebar instead of token payload.
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    }
  };

  return (
    <div className="bg-white bg p-6 rounded-lg m-auto my-auto shadow w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <label className="font-medium">Name:</label>
      <input type="text" value={name} className="w-full border p-2 rounded mb-3" onChange={(e) => setName(e.target.value)} />

      <label className="font-medium">Email:</label>
      <input type="text" value={email} disabled className="w-full border p-2 rounded mb-3 bg-gray-200" />

      <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>

      {message && <p className="mt-3 text-green-700 font-medium">{message}</p>}
    </div>
  );
};

export default Profile;
