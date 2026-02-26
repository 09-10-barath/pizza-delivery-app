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
- MongoDB Atlas account (for cloud database) or MongoDB installed locally

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pizza-delivery-app
   ```
2. Install dependencies:
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

### Configuration

#### Server (.env)
Create a `.env` file in the `server/` directory (see `.env.example`):
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@pizza.com
ADMIN_PASSWORD=admin
# Email (Mailtrap/SMTP)
EMAIL_USER=...
EMAIL_PASS=...
# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

#### Client (.env)
Create a `.env` file in the `client/` directory (see `.env.example`):
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=...
```

### Running the App

1. Start the Server:
   ```bash
   cd server
   npm start
   ```

2. Start the Client:
   ```bash
   cd client
   npm run dev
   ```

3. Open `http://localhost:5173`
