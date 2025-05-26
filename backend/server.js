require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const agentRoutes = require('./routes/agentRoutes');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const packageRoutes = require('./routes/packageRoutes');

const errorHandler = require('./middleware/errorHandler');

// Import your models here to ensure indexes
const User = require('./models/User');
const Package = require('./models/Package');
const AuditLog = require('./models/AuditLog');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and ensure indexes
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Ensure indexes for all models before starting server
    await User.init();
    await Package.init();
    await AuditLog.init();

    console.log('Indexes ensured');

    // Start server only after DB ready
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Mount routes (after app initialization is fine)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/packages', packageRoutes);

// Centralized error handler
app.use(errorHandler);
