import React from 'react';

const Dashboard = () => {
    return (
        <div className="p-8 text-center">
            <h1 className="text-4xl font-bold mb-8">Welcome to Pizza Paradise!</h1>
            <p className="text-xl mb-8">Select a pizza variety or build your own!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                    <h2 className="text-2xl font-bold mb-4">Custom Pizza</h2>
                    <p className="mb-4">Build your own pizza from scratch with your favorite toppings.</p>
                    <a href="/builder" className="bg-yellow-500 text-black px-6 py-2 rounded font-semibold inline-block">Build Now</a>
                </div>
                <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                    <h2 className="text-2xl font-bold mb-4">Menu Favorites</h2>
                    <p className="mb-4">Choose from our chef's special curated pizzas.</p>
                    <button className="bg-gray-800 text-white px-6 py-2 rounded font-semibold" disabled>Coming Soon</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
