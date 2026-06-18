import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import path from 'path';

// Import central error handling
import { errorHandler } from './middleware/errorHandler.js';

// Import router modules
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Set HTTP security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Compress response payloads
app.use(compression());

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static asset folder
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Sanitize inputs to prevent NoSQL injections
app.use(mongoSanitize());

// Sanitize inputs to prevent Cross-Site Scripting (XSS)
app.use(xss());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chat', chatRoutes);

// Root route check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'ShopMERN API is fully operational' });
});

// Capture unhandled routes (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Resource not found' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
