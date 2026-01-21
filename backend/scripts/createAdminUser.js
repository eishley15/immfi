#!/usr/bin/env node
/**
 * Setup script to create admin users in MongoDB
 * Run this script once to create your admin users
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/immfi');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`User "${username}" already exists!`);
      return;
    }

    const user = new User({
      username,
      password,
      role: 'admin'
    });

    await user.save();
    console.log(`✓ Admin user "${username}" created successfully!`);
  } catch (err) {
    console.error('Error creating user:', err.message);
  }
};

const main = async () => {
  await connectDB();

  console.log('\n=== Admin User Setup ===\n');

  let addMore = true;
  while (addMore) {
    await createAdminUser();
    const response = await question('\nAdd another user? (y/n): ');
    addMore = response.toLowerCase() === 'y';
  }

  rl.close();
  await mongoose.disconnect();
  console.log('\nSetup complete!');
};

main().catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});
