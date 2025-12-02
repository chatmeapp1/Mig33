
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, prisma } = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io and prisma accessible to routes
app.set('io', io);
app.set('prisma', prisma);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/chatrooms', require('./routes/chatrooms'));
app.use('/api/gifts', require('./routes/gifts'));
app.use('/api/credits', require('./routes/credits'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/admin', require('./routes/admin'));

// Socket.IO
require('./socket/chatSocket')(io, prisma);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const { disconnectDB } = require('./config/db');
process.on('beforeExit', disconnectDB);
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
