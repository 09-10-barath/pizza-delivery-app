import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/forgot-password`, { email });
            setMessage('A password reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="glass-card w-full max-w-md p-10 relative overflow-hidden bg-white/80 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>

                <div className="relative text-center mb-10">
                    <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-6">
                        <span className="text-3xl">🔑</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Forgot Password?</h2>
                    <p className="text-slate-500">Enter your email to receive a reset link</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

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

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full btn-primary text-lg mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <p className="text-center text-slate-500 text-sm">
                        Remembered your password? <Link to="/login" className="text-[#FF6B35] font-bold hover:underline">Back to Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
