// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient"; // important: our client that adds token
import {jwtDecode} from "jwt-decode";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const isSuper = decoded?.role === "SUPERADMIN";

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    clearTimeout(window._notifTimer);
    window._notifTimer = setTimeout(() => setNotif(null), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      showNotif(err?.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/admin/create-user", form);
      // successful -> re-fetch so list is always correct
      showNotif("User created");
      setForm({ name: "", email: "", password: "" });
      await loadUsers();
    } catch (err) {
      console.error(err);
      showNotif(err?.response?.data?.message || "Failed to create user", "error");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/admin/delete/${id}`);
      showNotif("User deleted");
      await loadUsers();
    } catch (err) {
      console.error(err);
      showNotif("Delete failed", "error");
    }
  };

  const promote = async (id) => {
    if (!isSuper) {
      showNotif("Unauthorized", "error");
      return;
    }
    try {
      await axios.post(`/admin/promote/${id}`);
      showNotif("User promoted to ADMIN");
      await loadUsers();
    } catch (err) {
      console.error(err);
      showNotif(err?.response?.data?.message || "Promote failed", "error");
    }
  };

  return (
    <div className="p-8">
      {notif && (
        <div className={`mb-4 p-3 rounded ${notif.type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
          {notif.msg}
        </div>
      )}

      <h1 className="text-3xl ml-10 font-bold mb-6">Manage Users</h1>

      <form onSubmit={addUser} className="bg-gray-100 p-6 rounded mb-6">
        <h2 className="text-xl mb-3">Add User</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full mb-2 rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-2 rounded" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-2 rounded" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-full rounded">Add User</button>
      </form>

      <h2 className="text-xl ml-5 mb-3">User List {loading && "(loading...)"}</h2>

      <div className="space-y-3 overflow-y-scroll h-[40vh]">
        {users.length === 0 && !loading && <div className="text-gray-600">No users found</div>}
        {users.map((u) => (
          <div key={u.id} className="bg-white p-3 m-4 shadow rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{u.name}</p>
              <p className="text-gray-600">{u.email}</p>
              <p className="text-sm text-gray-400">Role: {u.role}</p>
            </div>
            <div className="flex gap-2">
              {isSuper && u.role === "USER" && (
                <button onClick={() => promote(u.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">Promote</button>
              )}
              <button onClick={() => deleteUser(u.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
