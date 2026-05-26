require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

const MONGODB_URI = process.env.MONGODB_URI;

const createUsers = async () => {
  try {
    console.log('✅ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    // Clear existing users
    console.log('✅ Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Cleared existing users\n');
    // Create admin
    console.log('✅ Creating users...');
    const admin = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'pass123',
      role: 'admin',
      isActive: true
    });
    await admin.save();
    console.log('âœ… Admin: admin@test.com / pass123');
    // Create institution
    const institution = new User({
      name: 'Test University',
      email: 'institution@test.com',
      password: 'pass123',
      role: 'institution',
      isActive: true
    });
    await institution.save();
    console.log('âœ… Institution: institution@test.com / pass123');
    // Create student
    const student = new User({
      name: 'John Student',
      email: 'student@test.com',
      password: 'pass123',
      role: 'student',
      isActive: true
    });
    await student.save();
    //Create Faculty
    console.log('âœ… Student: student@test.com / pass123');
    const faculty = new User({
      name: 'Reddy Faculty',
      email: 'faculty@test.com',
      password: 'pass123',
      role: 'faculty',
      isActive: true
    });
    await student.save();
    console.log('âœ… Facultyt: faculty@test.com / pass123');

    console.log('\n' + '='.repeat(50));
    console.log('ðŸŽ‰ ALL TEST USERS CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\nYou can now login with:');
    console.log('  â€¢ admin@test.com / pass123');
    console.log('  â€¢ institution@test.com / pass123');
    console.log('  â€¢ student@test.com / pass123');
    console.log('  â€¢ faculty@test.com / pass123');
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('âŒ Error:', error);
    process.exit(1);
  }
};

createUsers();