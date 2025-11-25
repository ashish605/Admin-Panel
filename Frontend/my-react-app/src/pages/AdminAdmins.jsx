// src/pages/AdminAdmins.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient";

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    clearTimeout(window._notifTimer2);
    window._notifTimer2 = setTimeout(() => setNotif(null), 3500);
  };

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/admins");
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error(err);
      showNotif("Failed loading admins", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/create-admin", form);
      showNotif("Admin created");
      setForm({ name: "", email: "", password: "" });
      await loadAdmins();
    } catch (err) {
      console.error(err);
      showNotif(err?.response?.data?.message || "Create admin failed", "error");
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await axios.delete(`/admin/delete/${id}`);
      showNotif("Admin deleted");
      await loadAdmins();
    } catch (err) {
      console.error(err);
      showNotif("Delete failed", "error");
    }
  };

  return (
    <div className="p-8">
      {notif && <div className={`mb-4 p-3 rounded ${notif.type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>{notif.msg}</div>}
      <h1 className="text-3xl mb-6">Manage Admins</h1>

      <form onSubmit={addAdmin} className="bg-gray-100 p-6 rounded mb-6">
        <h2 className="text-xl mb-3">Add Admin</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full mb-2 rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-2 rounded" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-2 rounded" required />
        <button className="bg-purple-600 text-white p-2 w-full hover:bg-purple-700 rounded">Add Admin</button>
      </form>

      <h2 className="text-xl ml-5 mb-3">Admin List {loading && "(loading...)"}</h2>

      <div className="space-y-3 overflow-y-scroll h-[40vh]">
        {admins.map((a) => (
          <div key={a.id} className="bg-white p-3 m-4 shadow rounded flex  justify-between items-center">
            <div>
              <p className="font-bold">{a.name}</p>
              <p className="text-gray-600">{a.email}</p>
            </div>
            <button onClick={() => deleteAdmin(a.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded">Delete</button>
          </div>
        ))}
        {admins.length === 0 && !loading && <div className="text-gray-600">No admins found</div>}
      </div>
    </div>
  );
};

export default AdminAdmins;
