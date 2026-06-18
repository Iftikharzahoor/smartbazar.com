import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Configure dotenv variables
dotenv.config();

// Connect to persistence database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`ShopMERN Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
