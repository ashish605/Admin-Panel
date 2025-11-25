import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import AdminUsers from "../pages/AdminUsers";
import AdminAdmins from "../pages/AdminAdmins";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const AppRouter = () => {
    return (
        <Routes>

            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* USER + ADMIN + SUPERADMIN */}
            <Route element={<ProtectedRoute roles={["USER", "ADMIN", "SUPERADMIN"]} />}>
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
            </Route>

            {/* ADMIN + SUPERADMIN */}
            <Route element={<ProtectedRoute roles={["ADMIN", "SUPERADMIN"]} />}>
                <Route path="/admin/users" element={<Layout><AdminUsers /></Layout>} />
            </Route>

            {/* SUPERADMIN ONLY */}
            <Route element={<ProtectedRoute roles={["SUPERADMIN"]} />}>
                <Route path="/admin/admins" element={<Layout><AdminAdmins /></Layout>} />
            </Route>

            {/* Unknown route redirect */}
            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>
    );
};

export default AppRouter;
