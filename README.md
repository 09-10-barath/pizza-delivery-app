# Pizza Delivery Application

Full-stack Pizza Delivery App built with MERN stack (MongoDB, Express, React, Node.js).

## Features
- User Authentication (Login/Register)
- Custom Pizza Builder
- Admin Dashboard (Inventory/Orders)
- Razorpay Payment Integration
- Real-time Order Updates

## Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port (27017)

### Installation

1. Clone the repository (or download).
2. Install dependencies:

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Running the App

1. Start the Server:
```bash
cd server
npm start # or node server.js
```

2. Start the Client:
```bash
cd client
npm run dev
```

3. Open browser at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in `server/` with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pizza-delivery-app
JWT_SECRET=your_jwt_secret
EMAIL_USER=ethereal_user
EMAIL_PASS=ethereal_pass
RAZORPAY_KEY_ID=placeholder
RAZORPAY_KEY_SECRET=placeholder
```
