import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col gap-24 pb-24">
            {/* Hero Section */}
            <section className="relative px-8 pt-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            Now Delivering in your city
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-[#0F172A]">
                            Craft Your <span className="text-[#FF6B35]">Perfect</span> Pizza Experience
                        </h1>
                        <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                            From artisanal sourdough bases to exotic toppings, build the pizza you've always dreamed of. Fresh ingredients, lightning-fast delivery.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/builder" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                                <span>Start Building</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link to="/register" className="glass-card hover:bg-slate-50 text-[#0F172A] px-8 py-4 font-semibold transition-all shadow-lg">
                                Create Account
                            </Link>
                        </div>
                        <div className="pt-8 flex items-center gap-6 grayscale opacity-30">
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Trusted By</span>
                            <div className="flex gap-8 text-2xl font-black italic text-slate-800">
                                <span>PIZZAHUT</span>
                                <span>DOMINOS</span>
                                <span>PAPA</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-orange-500/10 blur-3xl rounded-full"></div>
                        <div className="relative glass-card p-4 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                                alt="Premium Pizza"
                                className="rounded-xl w-full h-[500px] object-cover"
                            />
                            <div className="absolute bottom-10 -left-10 glass-card p-6 flex items-center gap-4 animate-bounce hover:pause shadow-xl">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">⭐</div>
                                <div>
                                    <p className="font-bold text-[#0F172A]">4.9/5 Rating</p>
                                    <p className="text-xs text-slate-500">From 2k+ Pizza Lovers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-8 mb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Fresh Ingredients', desc: 'Sourced daily from local organic farms to ensure the highest quality.', icon: '🥗' },
                        { title: 'Custom Builder', desc: 'Choose from over 50+ toppings to create your unique masterpiece.', icon: '🛠️' },
                        { title: 'Express Delivery', desc: 'Our riders guarantee delivery within 30 minutes or it\'s on us.', icon: '⚡' }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-8 group hover:border-orange-500/50 transition-all shadow-lg hover:shadow-xl">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-4 text-[#0F172A]">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
