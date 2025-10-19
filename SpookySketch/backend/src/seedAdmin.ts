import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spookysketch';

async function seedAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'leomyler0@gmail.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      
      // Update to ensure admin tier
      if (existingAdmin.tier !== 'admin') {
        existingAdmin.tier = 'admin';
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin tier');
      }
      
      console.log('👑 Admin Account Details:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Username:', existingAdmin.username);
      console.log('   Tier:', existingAdmin.tier);
      console.log('   Avatar:', existingAdmin.avatar);
    } else {
      // Create new admin user
      const adminUser = new User({
        username: 'Admin',
        email: 'leomyler0@gmail.com',
        password: 'SuperBoy2020', // Will be hashed by pre-save hook
        tier: 'admin',
        avatar: '👑',
        isAdmin: true,
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║        🎃 ADMIN ACCOUNT CREATED 👑                    ║');
      console.log('╚═══════════════════════════════════════════════════════╝');
      console.log('');
      console.log('📧 Email:    leomyler0@gmail.com');
      console.log('🔒 Password: SuperBoy2020');
      console.log('👑 Tier:     ADMIN (Full Access)');
      console.log('');
      console.log('✅ You can now login with these credentials!');
      console.log('');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seeder
seedAdminUser();
