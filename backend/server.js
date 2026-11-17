require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cmsCache = require('./utils/cmsCache');

const app = express();

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_CLIENT_URL].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', apiLimiter);

// Serve uploaded treatment/blog images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/gifts', require('./routes/giftRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Knead Me API is running' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await cmsCache.loadCacheFromDB(); // populate the in-memory CMS cache once, before serving any traffic
  app.listen(PORT, () => console.log(`Knead Me API listening on port ${PORT}`));
};

start();
