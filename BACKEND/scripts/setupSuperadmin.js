import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const setupSuperadmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperadmin = await User.findOne({ email: 'superadmin@example.com' });
    
    if (existingSuperadmin) {
      console.log('Superadmin already exists');
      return;
    }

    // Create superadmin user
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superadmin = new User({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'superadmin'
    });

    await superadmin.save();
    console.log('Superadmin created successfully');
    console.log('Email: superadmin@example.com');
    console.log('Password: superadmin123');
    
  } catch (error) {
    console.error('Error setting up superadmin:', error);
  } finally {
    mongoose.connection.close();
  }
};

setupSuperadmin();
