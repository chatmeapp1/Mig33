const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Neon PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

const userQueries = {
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  findByUsername: (username) => prisma.user.findUnique({ where: { username } }),
  create: (data) => prisma.user.create({ data }),
  update: (id, data) => prisma.user.update({ where: { id }, data }),
  delete: (id) => prisma.user.delete({ where: { id } }),
  findAll: (options = {}) => prisma.user.findMany(options),
  count: (where = {}) => prisma.user.count({ where }),
};

const messageQueries = {
  findById: (id) => prisma.message.findUnique({ where: { id } }),
  create: (data) => prisma.message.create({ data }),
  findByChat: (chatroomId, options = {}) => 
    prisma.message.findMany({ where: { chatroomId }, ...options }),
  findPrivate: (senderId, receiverId, options = {}) => 
    prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ],
        isPrivate: true
      },
      ...options
    }),
  markAsRead: (id) => prisma.message.update({ where: { id }, data: { read: true } }),
  delete: (id) => prisma.message.delete({ where: { id } }),
};

const chatroomQueries = {
  findById: (id) => prisma.chatroom.findUnique({ where: { id } }),
  create: (data) => prisma.chatroom.create({ data }),
  update: (id, data) => prisma.chatroom.update({ where: { id }, data }),
  delete: (id) => prisma.chatroom.delete({ where: { id } }),
  findAll: (options = {}) => prisma.chatroom.findMany(options),
  findPublic: (options = {}) => 
    prisma.chatroom.findMany({ where: { type: 'public', isActive: true }, ...options }),
  findByOwner: (ownerId) => prisma.chatroom.findMany({ where: { ownerId } }),
};

const giftQueries = {
  findById: (id) => prisma.gift.findUnique({ where: { id } }),
  create: (data) => prisma.gift.create({ data }),
  update: (id, data) => prisma.gift.update({ where: { id }, data }),
  delete: (id) => prisma.gift.delete({ where: { id } }),
  findAll: (options = {}) => prisma.gift.findMany(options),
  findActive: () => prisma.gift.findMany({ where: { isActive: true } }),
  findByCategory: (category) => prisma.gift.findMany({ where: { category, isActive: true } }),
};

const transactionQueries = {
  findById: (id) => prisma.transaction.findUnique({ where: { id } }),
  create: (data) => prisma.transaction.create({ data }),
  findByUser: (userId, options = {}) => 
    prisma.transaction.findMany({ where: { userId }, ...options }),
  findAll: (options = {}) => prisma.transaction.findMany(options),
};

module.exports = { 
  prisma, 
  connectDB, 
  disconnectDB,
  userQueries,
  messageQueries,
  chatroomQueries,
  giftQueries,
  transactionQueries
};
