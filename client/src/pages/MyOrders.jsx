import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await axios.get('${import.meta.env.VITE_API_URL}/api/orders', {
                    headers: { 'auth-token': user.token }
                });
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold text-gray-600">Loading your orders...</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet.</p>
                    <Link
                        to="/builder"
                        className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                        Build Your Pizza
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Order Received':
                return 'bg-blue-100 text-blue-800';
            case 'In the Kitchen':
                return 'bg-yellow-100 text-yellow-800';
            case 'Sent to Delivery':
                return 'bg-purple-100 text-purple-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2 text-[#0F172A]">My <span className="text-[#FF6B35]">Orders</span></h1>
                <p className="text-slate-500">Track your pizza journey from kitchen to doorstep.</p>
            </header>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="glass-card p-8 group hover:border-orange-500/30 transition-all shadow-sm hover:shadow-md bg-white/60"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <h2 className="text-xl font-bold text-[#0F172A]">
                                        Order #{order._id.slice(-6)}
                                    </h2>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📅</span>
                                        <div className="text-sm">
                                            <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-widest">Ordered on</p>
                                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🍕</span>
                                        <div className="text-sm">
                                            <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-widest">Quantity</p>
                                            <p className="font-medium">{order.items.length} Custom Pizza{order.items.length > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                                <div className="text-right">
                                    <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-3xl font-extrabold text-[#FFB100]">₹{order.totalAmount}</p>
                                </div>

                                <Link
                                    to={`/order/${order._id}`}
                                    className="btn-primary py-3 px-8 whitespace-nowrap shadow-lg shadow-orange-500/20"
                                >
                                    Track Order
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
