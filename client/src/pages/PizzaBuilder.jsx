import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PizzaBuilder = () => {
    const [inventory, setInventory] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [base, setBase] = useState(null);
    const [sauce, setSauce] = useState(null);
    const [cheese, setCheese] = useState(null);
    const [veggies, setVeggies] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const steps = [
        { id: 'base', name: 'Base', icon: '🍞' },
        { id: 'sauce', name: 'Sauce', icon: '🍅' },
        { id: 'cheese', name: 'Cheese', icon: '🧀' },
        { id: 'veggie', name: 'Veggies', icon: '🥦' }
    ];

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/inventory');
                setInventory(res.data);
            } catch (err) {
                console.error("Failed to fetch inventory", err);
            }
        };
        fetchInventory();
    }, []);

    const handleVeggieChange = (veggie) => {
        if (veggies.find(v => v._id === veggie._id)) {
            setVeggies(veggies.filter(v => v._id !== veggie._id));
        } else {
            setVeggies([...veggies, veggie]);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        if (base) total += base.price;
        if (sauce) total += sauce.price;
        if (cheese) total += cheese.price;
        veggies.forEach(v => total += v.price);
        return total;
    };

    const handleCheckout = async () => {
        if (!user) {
            alert('Please login to place an order');
            navigate('/login');
            return;
        }
        if (!base || !sauce || !cheese) {
            alert('Please select Base, Sauce, and Cheese');
            return;
        }

        const orderData = {
            items: [{
                base: base._id,
                sauce: sauce._id,
                cheese: cheese._id,
                veggies: veggies.map(v => v._id)
            }],
            totalAmount: calculateTotal(),
        };

        try {
            const { data: { id: order_id, currency } } = await axios.post('http://localhost:5000/api/payment/create-order', {
                amount: calculateTotal()
            });

            const options = {
                key: "rzp_test_SEWOmJZrwp4Pvz",
                amount: calculateTotal() * 100,
                currency: currency,
                name: "PIZZACRAFT",
                description: "Custom Pizza Order",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await axios.post('http://localhost:5000/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        const res = await axios.post('http://localhost:5000/api/orders', {
                            ...orderData,
                            paymentId: response.razorpay_payment_id
                        }, {
                            headers: { 'auth-token': user.token }
                        });
                        navigate(`/order/${res.data._id}`);
                    } catch (error) {
                        console.error(error);
                        alert("Payment verification failed.");
                    }
                },
                theme: { color: "#FF6B35" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            console.error(err);
            alert("Payment initialization failed");
        }
    };

    const renderItemCard = (item, isSelected, onClick) => (
        <button
            key={item._id}
            onClick={onClick}
            className={`group relative overflow-hidden glass-card text-left transition-all duration-300 shadow-sm hover:shadow-md ${isSelected ? 'ring-2 ring-[#FF6B35] bg-orange-50' : 'hover:bg-slate-50'}`}
        >
            <div className="h-40 overflow-hidden relative">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">
                        {item.category === 'base' ? '🥯' : item.category === 'sauce' ? '🥫' : item.category === 'cheese' ? '🧀' : '🍕'}
                    </div>
                )}
                {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#FF6B35] text-white p-1.5 rounded-full shadow-lg z-10 transition-transform duration-300 scale-110">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg text-[#0F172A] mb-1 group-hover:text-[#FF6B35] transition-colors">{item.name}</h3>
                <p className="text-[#FF6B35] font-extrabold">₹{item.price}</p>
            </div>
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2 text-[#0F172A]">Build Your <span className="text-[#FF6B35]">Masterpiece</span></h1>
                <p className="text-slate-500">Follow the steps below to craft your perfect pizza.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Stepper */}
                    <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
                        {steps.map((step, idx) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(idx)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all whitespace-nowrap shadow-sm ${activeStep === idx ? 'bg-[#FF6B35] border-[#FF6B35] text-white shadow-lg shadow-orange-500/20' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                            >
                                <span>{step.icon}</span>
                                <span className="font-semibold">{step.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {inventory
                            .filter(i => i.category === steps[activeStep].id)
                            .map(item => {
                                let isSelected = false;
                                let onClick = () => { };

                                if (steps[activeStep].id === 'base') {
                                    isSelected = base?._id === item._id;
                                    onClick = () => setBase(item);
                                } else if (steps[activeStep].id === 'sauce') {
                                    isSelected = sauce?._id === item._id;
                                    onClick = () => setSauce(item);
                                } else if (steps[activeStep].id === 'cheese') {
                                    isSelected = cheese?._id === item._id;
                                    onClick = () => setCheese(item);
                                } else if (steps[activeStep].id === 'veggie') {
                                    isSelected = veggies.some(v => v._id === item._id);
                                    onClick = () => handleVeggieChange(item);
                                }

                                return renderItemCard(item, isSelected, onClick);
                            })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between">
                        <button
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="px-8 py-3 glass-card text-slate-500 disabled:opacity-30 transition-opacity shadow-sm"
                        >
                            Previous Step
                        </button>
                        {activeStep < 3 ? (
                            <button
                                onClick={() => setActiveStep(prev => prev + 1)}
                                className="btn-primary"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={handleCheckout}
                                className="btn-accent"
                            >
                                Review & Checkout
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Summary */}
                <aside className="w-full lg:w-96">
                    <div className="glass-card p-8 sticky top-32 shadow-xl bg-white/80">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#0F172A]">
                            <span>🛒</span> Your Order
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500">Base</span>
                                <span className="font-medium text-[#0F172A]">{base ? base.name : 'Not selected'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500">Sauce</span>
                                <span className="font-medium text-[#0F172A]">{sauce ? sauce.name : 'Not selected'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500">Cheese</span>
                                <span className="font-medium text-[#0F172A]">{cheese ? cheese.name : 'Not selected'}</span>
                            </div>
                            <div className="py-3">
                                <span className="text-slate-500 block mb-2">Veggies</span>
                                <div className="flex flex-wrap gap-2">
                                    {veggies.length > 0 ? veggies.map(v => (
                                        <span key={v._id} className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200 text-[#0F172A]">{v.name}</span>
                                    )) : <span className="text-sm text-slate-400 font-medium italic">No veggies added</span>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-slate-600 font-medium">Total Amount</span>
                                <span className="text-3xl font-extrabold text-[#FFB100]">₹{calculateTotal()}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/30 hover:bg-[#E85A2A] transition-all active:scale-[0.98] relative z-20"
                            >
                                Checkout Now
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-4">Secure payment powered by Razorpay</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PizzaBuilder;
