import React, { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");     // FIX HERE
    const [password, setPassword] = useState(""); // FIX HERE
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded w-96">
                <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

                {error && <p className="text-red-500 mb-3">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // FIX
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // FIX
                />

                <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                    Forgot Password?
                </Link>

                <button className="w-full bg-blue-600 text-white p-2 rounded mt-3">
                    Login
                </button>
            </form>


        </div>
    );
};

export default Login;
