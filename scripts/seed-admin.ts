#!/usr/bin/env node

/**
 * Seed script to create the first admin user
 * Usage: npm run seed-admin -- --email admin@example.com --password YourPassword123
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from '../Database/mongoose';
import { User, UserRole } from '../Database/models/user.model';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

// Simple argument parser
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        parsed[key] = value;
        i++;
      }
    }
  }

  return parsed;
}

async function seedAdmin() {
  try {
    const args = parseArgs();
    const email = args.email;
    const password = args.password;

    if (!email || !password) {
      console.error('❌ Error: Email and password are required');
      console.log('Usage: npm run seed-admin -- --email admin@example.com --password YourPassword123');
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Error: Invalid email format');
      process.exit(1);
    }

    // Validate password length
    if (password.length < 8) {
      console.error('❌ Error: Password must be at least 8 characters long');
      process.exit(1);
    }

    console.log('🔄 Connecting to database...');
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('MongoDB connection not found');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      if (existingUser.role === UserRole.ADMIN) {
        console.log('ℹ️  User already exists and is already an admin');
        console.log(`✅ Admin email: ${existingUser.email}`);
        console.log(`🔐 You can now log in with your credentials at /sign-in`);
        process.exit(0);
      } else {
        // Upgrade existing user to admin
        existingUser.role = UserRole.ADMIN;
        await existingUser.save();
        console.log('✅ Existing user upgraded to admin role');
        console.log(`📧 Admin email: ${existingUser.email}`);
        console.log(`🔐 You can now log in with your credentials at /sign-in`);
        process.exit(0);
      }
    }

    // Create Better Auth instance for this script
    console.log('🔄 Initializing Better Auth...');
    const auth = betterAuth({
      database: mongodbAdapter(db),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL,
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
        autoSignIn: false,
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: UserRole.USER,
            required: false,
            input: false,
          },
        }
      },
      plugins: [nextCookies()],
    });

    // Create admin user using Better Auth's internal API
    console.log('🔄 Creating admin user with Better Auth...');
    
    // Use Better Auth's internal API to create user with password
    const result = await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password: password,
        name: 'Admin',
      },
    });

    if (!result || !result.user) {
      throw new Error('Failed to create user with Better Auth');
    }

    // Update the user role to admin
    const adminUser = await User.findByIdAndUpdate(
      result.user.id,
      { 
        role: UserRole.ADMIN,
        emailVerified: true,
      },
      { new: true }
    );

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminUser?.email}`);
    console.log(`🔑 Role: ${adminUser?.role}`);
    console.log(`🔐 You can now log in with your credentials at /sign-in`);
    console.log('\n🎉 Setup complete! Your admin account is ready to use.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
