import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 py-3 px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <span className="text-2xl">🍕</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">PIZZA<span className="text-[#FF6B35]">CRAFT</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <Link to="/builder" className="text-sm font-medium text-slate-600 hover:text-[#FF6B35] transition-colors">Custom Pizza</Link>
                {user && (
                    <>
                        <Link to="/my-orders" className="text-sm font-medium text-slate-600 hover:text-[#FF6B35] transition-colors">My Orders</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-[#FF6B35] transition-colors">Admin</Link>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-sm text-slate-500">Hi, <span className="text-[#0F172A] font-medium">{user.name}</span></span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-[#0F172A] px-2">Login</Link>
                        <Link to="/register" className="btn-primary py-1.5 px-5 text-sm">Join Now</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
