import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/reset-password/${token}`, { password });
            setMessage('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password. The link may be invalid or expired.');
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
                        <span className="text-3xl">🛡️</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Set New Password</h2>
                    <p className="text-slate-500">Pick something strong and memorable</p>
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
                        <label className="text-sm font-semibold text-slate-600 ml-1">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full input-field"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full input-field"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full btn-primary text-lg mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    <p className="text-center text-slate-500 text-sm">
                        Back to <Link to="/login" className="text-[#FF6B35] font-bold hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
