import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your actual backend URL
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, { email, password });
            login(res.data);
            alert('Login Successful');
            navigate(res.data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            alert(err.response?.data || 'Login Failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="glass-card w-full max-w-md p-10 relative overflow-hidden bg-white/80 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>

                <div className="relative text-center mb-10">
                    <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-6">
                        <span className="text-3xl">🍕</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Welcome Back</h2>
                    <p className="text-slate-500">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full input-field"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-semibold text-slate-600">Password</label>
                            <Link to="/forgot-password" size="xs" className="text-xs text-[#FF6B35] hover:underline font-medium">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary text-lg mt-4">
                        Sign In
                    </button>
                    <p className="text-center text-slate-500 text-sm">
                        Don't have an account? <a href="/register" className="text-[#FF6B35] font-bold hover:underline">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
