const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spookysketch';

// User Schema (matching your User model)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tier: { type: String, enum: ['free', 'pro', 'vip', 'admin'], default: 'free' },
  avatar: { type: String, default: '👻' },
  isAdmin: { type: Boolean, default: false },
  stripeCustomerId: String,
  subscriptionId: String,
  subscriptionStatus: String,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// VIP Accounts to create
const vipAccounts = [
  {
    username: 'Janet',
    email: 'ronet@gmail.com',
    password: 'janet',
    tier: 'vip',
    avatar: '👑'
  },
  {
    username: 'Nicky23',
    email: 'nicky23@gmail.com',
    password: 'maina',
    tier: 'vip',
    avatar: '💎'
  }
];

async function createVIPAccounts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const account of vipAccounts) {
      console.log(`\n📝 Creating VIP account: ${account.email}`);

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: account.email },
          { username: account.username }
        ]
      });

      if (existingUser) {
        console.log(`⚠️  User already exists: ${account.email}`);
        
        // Update to VIP if not already
        if (existingUser.tier !== 'vip') {
          existingUser.tier = 'vip';
          await existingUser.save();
          console.log(`✅ Updated ${account.email} to VIP tier`);
        } else {
          console.log(`✅ ${account.email} is already VIP`);
        }
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);

      // Create new VIP user
      const newUser = new User({
        username: account.username,
        email: account.email,
        password: hashedPassword,
        tier: account.tier,
        avatar: account.avatar,
        isAdmin: false
      });

      await newUser.save();
      console.log(`✅ Created VIP account: ${account.email}`);
      console.log(`   👤 Username: ${account.username}`);
      console.log(`   ${account.avatar} Tier: VIP`);
    }

    console.log('\n🎉 All VIP accounts created successfully!');
    console.log('\n📋 Account Details:');
    console.log('═══════════════════════════════════════');
    console.log('Account 1:');
    console.log('  Email: ronet@gmail.com');
    console.log('  Password: janet');
    console.log('  Tier: VIP 👑');
    console.log('\nAccount 2:');
    console.log('  Email: nicky23@gmail.com');
    console.log('  Password: maina');
    console.log('  Tier: VIP 💎');
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error creating VIP accounts:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
createVIPAccounts();
