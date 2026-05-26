const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = (aadhaarNumber) => {
  // Mock OTP - use last 6 digits of Aadhaar for demo
  // In production, generate random 6-digit number
  return aadhaarNumber.slice(-6);
};

// Send Aadhaar OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { aadhaarNumber, userId } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Aadhaar number' 
      });
    }

    // Generate OTP
    const otp = generateOTP(aadhaarNumber);
    
    // Store OTP with 5 minute expiry
    const otpKey = `${userId}_${aadhaarNumber}`;
    otpStore.set(otpKey, {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0
    });

    // In production, send OTP via SMS gateway
    console.log(`📱 OTP for Aadhaar ${aadhaarNumber}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp // ONLY FOR DEMO - Remove in production
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify Aadhaar OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { aadhaarNumber, otp, userId } = req.body;

    if (!aadhaarNumber || !otp || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const otpKey = `${userId}_${aadhaarNumber}`;
    const storedOtpData = otpStore.get(otpKey);

    if (!storedOtpData) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found or expired. Please request new OTP.' 
      });
    }

    // Check expiry
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(otpKey);
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired. Please request new OTP.' 
      });
    }

    // Check attempts (max 3)
    if (storedOtpData.attempts >= 3) {
      otpStore.delete(otpKey);
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum attempts exceeded. Please request new OTP.' 
      });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts += 1;
      otpStore.set(otpKey, storedOtpData);
      
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${3 - storedOtpData.attempts} attempts remaining.` 
      });
    }

    // OTP verified successfully
    otpStore.delete(otpKey);

    // Update user with Aadhaar verification status (optional)
    await User.findByIdAndUpdate(userId, {
      aadhaarVerified: true,
      aadhaarNumber: aadhaarNumber,
      lastAadhaarVerification: new Date()
    });

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (!['admin', 'student', 'institution', 'faculty'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Faculty Registration
router.post('/register/faculty', async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'faculty'
    });
    await user.save();

    const Teacher = require('../models/teacher.model');
    const faculty = new Teacher({
      name,
      email,
      department,
      designation: designation || 'Assistant Professor',
      userId: user._id
    });
    await faculty.save();

    const token = jwt.sign(
      { userId: user._id, role: 'faculty' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
      token,
      userId: user._id,
      role: 'faculty',
      name: user.name
    });

  } catch (error) {
    console.error("Faculty Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Wrong password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clean up expired OTPs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

module.exports = router;