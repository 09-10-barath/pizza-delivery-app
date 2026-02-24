import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, { name, email, password });
            alert('Registration Successful. Please Login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data || 'Registration Failed');
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
                    <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Join PizzaCraft</h2>
                    <p className="text-slate-500">Create your account to start crafting</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full input-field"
                            required
                        />
                    </div>
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
                        <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
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
                        Create Account
                    </button>
                    <p className="text-center text-slate-500 text-sm">
                        Already have an account? <Link to="/login" className="text-[#FF6B35] font-bold hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
