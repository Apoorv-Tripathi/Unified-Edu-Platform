require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const chatRoutes = require("./routes/chat.routes");
const analyticsRoutes = require('./routes/analytics.routes');

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const studentRoutes = require('./routes/student.routes');
const institutionRoutes = require('./routes/institution.routes');
const teacherRoutes = require('./routes/teacher.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/chat", chatRoutes); app.use('/api/analytics', analyticsRoutes);

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("📦 Database connected.");
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed!", err);
    process.exit(1);
  });
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVER STARTED');
  console.log('='.repeat(50));
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔗 Auth: /api/auth`);
  console.log(`👨‍🎓 Students: /api/students`);
  console.log(`🏛️  Institutions: /api/institutions`);
  console.log(`👨‍🏫 Teachers: /api/teachers`);
  console.log(`👥 Users: /api/users`);
  console.log('='.repeat(50) + '\n');
});