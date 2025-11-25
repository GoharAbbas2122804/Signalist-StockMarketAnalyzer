#!/usr/bin/env node

/**
 * Script to delete a user by email
 * Usage: npm run delete-user -- --email admin@example.com
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from '../Database/mongoose';
import { User } from '../Database/models/user.model';

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

async function deleteUser() {
  try {
    const args = parseArgs();
    const email = args.email;

    if (!email) {
      console.error('❌ Error: Email is required');
      console.log('Usage: npm run delete-user -- --email admin@example.com');
      process.exit(1);
    }

    console.log('🔄 Connecting to database...');
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`ℹ️  No user found with email: ${email}`);
      process.exit(0);
    }

    await User.deleteOne({ email: email.toLowerCase() });
    console.log(`✅ User deleted successfully: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    process.exit(1);
  }
}

deleteUser();
