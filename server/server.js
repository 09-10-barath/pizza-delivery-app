const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Socket.io Setup
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Serve static files from client public folder
app.use('/images', express.static(path.join(__dirname, '../client/public/ingredients')));

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join_order', (orderId) => {
    socket.join(orderId);
    console.log(`User joined order room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// Routes
const authRoute = require('./routes/auth');
const inventoryRoute = require('./routes/inventory');
const orderRoute = require('./routes/order');
const paymentRoute = require('./routes/payment');

app.use('/api/user', authRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment', paymentRoute);

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const hasUri = !!process.env.MONGO_URI;
  res.send(`Pizza Delivery API is running - Version 1.0.3 - DB: ${dbStatus} - URI: ${hasUri}`);
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  //  useNewUrlParser: true,
  //  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
