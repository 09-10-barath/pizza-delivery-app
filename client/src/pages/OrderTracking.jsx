import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const socket = io('${import.meta.env.VITE_API_URL}');

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                    headers: { 'auth-token': user.token }
                }); // Need to implement get single order route
                setOrder(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrder();

        socket.emit('join_order', id);

        socket.on('order_updated', (updatedOrder) => {
            setOrder(updatedOrder);
            alert(`Order status updated to: ${updatedOrder.status}`);
        });

        return () => {
            socket.off('order_updated');
        };
    }, [id, user]);

    if (!order) return <div className="p-8">Loading...</div>;

    const steps = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];
    const currentStep = steps.indexOf(order.status);

    return (
        <div className="max-w-3xl mx-auto px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-2 text-[#0F172A]">Track Order <span className="text-[#FF6B35]">#{order._id.slice(-6)}</span></h1>
                <p className="text-slate-500">Live updates from our kitchen to your home.</p>
            </header>

            <div className="relative flex justify-between items-center mb-16 px-4">
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -z-10 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1.5 bg-green-500 -z-10 transition-all duration-1000 ease-out rounded-full shadow-lg shadow-green-500/20"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

                {steps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 shadow-xl 
                            ${index <= currentStep ? 'bg-green-500 text-white scale-110' : 'bg-white border border-slate-200 text-slate-300'}`}>
                            {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span className={`absolute -bottom-8 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors duration-500 ${index <= currentStep ? 'text-[#0F172A]' : 'text-slate-300'}`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>

            <div className="glass-card bg-white/80 p-8 shadow-2xl relative overflow-hidden mt-12">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-[#0F172A]">
                    <span className="text-2xl">📋</span> Order Details
                </h2>

                <div className="space-y-6">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                            <p className="font-extrabold text-[#0F172A] mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">🍕</span>
                                Custom Pizza {idx + 1}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm ml-10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Base</p>
                                    <p className="text-slate-700 font-medium">{item.base?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Sauce</p>
                                    <p className="text-slate-700 font-medium">{item.sauce?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Cheese</p>
                                    <p className="text-slate-700 font-medium">{item.cheese?.name || 'N/A'}</p>
                                </div>
                                {item.veggies && item.veggies.length > 0 && (
                                    <div className="col-span-1 sm:col-span-2">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Veggies</p>
                                        <p className="text-slate-700 font-medium">{item.veggies.map(v => v.name).join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Payment Status</span>
                    <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">Paid</span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-slate-800 font-bold text-lg">Total Amount</span>
                    <span className="text-3xl font-extrabold text-[#FFB100]">₹{order.totalAmount}</span>
                </div>
            </div>

            <p className="text-center text-slate-400 text-xs mt-12">
                Questions about your order? <a href="#" className="text-[#FF6B35] font-bold hover:underline">Contact Support</a>
            </p>
        </div>
    );
};

export default OrderTracking;
