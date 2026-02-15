import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchOrders();
        fetchInventory();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders/all', {
                headers: { 'auth-token': user.token }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchInventory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            setInventory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`,
                { status },
                { headers: { 'auth-token': user.token } }
            );
            fetchOrders(); // Refresh orders
            alert('Status Updated');
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const updateStock = async (pizzaId, newStock) => {
        try {
            await axios.post(`http://localhost:5000/api/inventory/update-stock/${pizzaId}`,
                { stock: newStock },
                { headers: { 'auth-token': user.token } }
            );
            fetchInventory(); // Refresh inventory
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    const updateImage = async (pizzaId, newImage) => {
        try {
            await axios.patch(`http://localhost:5000/api/inventory/update-image/${pizzaId}`,
                { image: newImage },
                { headers: { 'auth-token': user.token } }
            );
            fetchInventory();
            alert('Image updated successfully!');
        } catch (err) {
            alert('Failed to update image');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2 text-[#0F172A]">Admin <span className="text-[#FF6B35]">Dashboard</span></h1>
                <p className="text-slate-500">Manage orders and maintain inventory with precision.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Orders Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#0F172A]">
                        <span className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-xl">📦</span>
                        Recent Orders
                    </h2>
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order._id} className="glass-card p-6 bg-white/60 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="font-bold text-lg text-[#0F172A]">Order #{order._id.slice(-6)}</span>
                                        <p className="text-sm text-slate-500 mb-1">{new Date(order.createdAt).toLocaleString()}</p>
                                        <p className="text-sm font-medium text-[#FF6B35]">User: {order.user?.name || 'Unknown'}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Order Received' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="bg-slate-50/50 rounded-xl p-4 mb-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="text-sm">
                                            <p className="font-bold text-[#0F172A] mb-2">Custom Pizza (₹{order.totalAmount})</p>
                                            <div className="grid grid-cols-2 gap-y-2 text-xs">
                                                <p><span className="text-slate-400">Base:</span> <span className="text-slate-700 font-medium">{item.base?.name}</span></p>
                                                <p><span className="text-slate-400">Sauce:</span> <span className="text-slate-700 font-medium">{item.sauce?.name}</span></p>
                                                <p><span className="text-slate-400">Cheese:</span> <span className="text-slate-700 font-medium">{item.cheese?.name}</span></p>
                                                {item.veggies?.length > 0 && (
                                                    <p className="col-span-2"><span className="text-slate-400">Veggies:</span> <span className="text-slate-700 font-medium">{item.veggies.map(v => v.name).join(', ')}</span></p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                                    {['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => updateStatus(order._id, status)}
                                            disabled={order.status === status}
                                            className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-lg transition-all ${order.status === status ? 'bg-[#FF6B35] text-white shadow-inner scale-[0.98]' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-[#FF6B35] hover:text-[#FF6B35] shadow-sm hover:shadow-md'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <p className="text-slate-500 italic">No orders yet.</p>}
                    </div>
                </div>

                {/* Inventory Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#0F172A]">
                        <span className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-xl">🍅</span>
                        Inventory
                    </h2>
                    <div className="glass-card bg-white/60 shadow-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Item</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Stock</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Image URL</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item._id} className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0F172A]">{item.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[#FF6B35] font-bold">{item.category}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.stock < 20 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    defaultValue={item.image}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== item.image) {
                                                            updateImage(item._id, e.target.value);
                                                        }
                                                    }}
                                                    className="text-xs bg-white border border-slate-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                                                    placeholder="/ingredients/..."
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => updateStock(item._id, item.stock + 10)}
                                                    className="w-12 h-12 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center text-xl font-bold hover:bg-[#E85A2A] hover:rotate-90 transition-all shadow-lg shadow-orange-500/30"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => updateStock(item._id, Math.max(0, item.stock - 10))}
                                                    className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-md"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
