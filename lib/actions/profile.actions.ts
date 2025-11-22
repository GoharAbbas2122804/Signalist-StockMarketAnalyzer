'use server';

import { connectToDatabase } from "@/Database/mongoose";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { Watchlist } from "@/Database/models/watchlist.model";

// Response interface for consistency
interface ProfileActionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Helper function to find user with flexible ID matching
 */
async function findUser(db: any, sessionUser: any) {
  console.log('Server action: Looking up user:', {
    id: sessionUser.id,
    email: sessionUser.email
  });

  let user = null;

  // Strategy 1: Look up by id field
  user = await db.collection('user').findOne({ id: sessionUser.id });
  if (user) {
    console.log('Server action: User found by id field');
    return user;
  }

  // Strategy 2: Look up by email
  if (sessionUser.email) {
    user = await db.collection('user').findOne({ email: sessionUser.email.toLowerCase() });
    if (user) {
      console.log('Server action: User found by email');
      return user;
    }
  }

  // Strategy 3: Look up by _id if ObjectId
  try {
    const { ObjectId } = require('mongodb');
    if (ObjectId.isValid(sessionUser.id)) {
      user = await db.collection('user').findOne({ _id: new ObjectId(sessionUser.id) });
      if (user) {
        console.log('Server action: User found by _id');
        return user;
      }
    }
  } catch (error) {
    console.log('Server action: ObjectId lookup failed');
  }

  console.error('Server action: User not found after all strategies');
  return null;
}

/**
 * Helper function to update user with flexible ID matching
 */
async function updateUser(db: any, sessionUser: any, updateData: any) {
  let result = null;

  // Strategy 1: Update by id field
  result = await db.collection('user').updateOne(
    { id: sessionUser.id },
    { $set: updateData }
  );
  
  if (result.matchedCount > 0) {
    console.log('Server action: User updated by id field');
    return result;
  }

  // Strategy 2: Update by email
  if (sessionUser.email) {
    result = await db.collection('user').updateOne(
      { email: sessionUser.email.toLowerCase() },
      { $set: updateData }
    );
    
    if (result.matchedCount > 0) {
      console.log('Server action: User updated by email');
      return result;
    }
  }

  console.error('Server action: User update failed');
  return result;
}

/**
 * Update user profile information
 */
export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
}): Promise<ProfileActionResponse> => {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return { success: false, error: 'Database connection failed' };
    }

    const updateData: any = { updatedAt: new Date() };

    // Add fields to update
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.image !== undefined) updateData.image = data.image;
    
    // Handle password update through Better Auth
    if (data.password) {
      try {
        await auth.api.changePassword({
          body: {
            newPassword: data.password,
            currentPassword: data.password,
          },
          headers: await headers()
        });
      } catch (error) {
        console.error('Server action: Password update failed:', error);
        return { success: false, error: 'Failed to update password' };
      }
    }

    // Check user exists
    const existingUser = await findUser(db, session.user);
    if (!existingUser) {
      return { success: false, error: 'User not found in database' };
    }

    // Update user in database
    const result = await updateUser(db, session.user, updateData);

    if (!result || result.matchedCount === 0) {
      return { success: false, error: 'Failed to update user in database' };
    }

    // Fetch updated user data
    const updatedUser = await findUser(db, session.user);

    if (!updatedUser) {
      return { success: false, error: 'Failed to fetch updated profile' };
    }

    return { 
      success: true, 
      data: {
        id: updatedUser.id || updatedUser._id?.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image
      }
    };
  } catch (error) {
    console.error('Server action: Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
};

/**
 * Delete user account and all associated data
 */
export const deleteUserAccount = async (): Promise<ProfileActionResponse> => {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return { success: false, error: 'Database connection failed' };
    }

    const userId = session.user.id;

    // Delete all watchlist items for this user
    await Watchlist.deleteMany({ userId });

    // Delete user account with flexible matching
    let result = await db.collection('user').deleteOne({ id: userId });
    
    // Fallback: try deleting by email
    if (result.deletedCount === 0 && session.user.email) {
      result = await db.collection('user').deleteOne({ email: session.user.email });
    }

    if (result.deletedCount === 0) {
      return { success: false, error: 'User not found' };
    }

    // Sign out the user
    await auth.api.signOut({ headers: await headers() });

    return { success: true };
  } catch (error) {
    console.error('Server action: Delete account error:', error);
    return { success: false, error: 'Failed to delete account' };
  }
};

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<ProfileActionResponse> => {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return { success: false, error: 'Database connection failed' };
    }

    const user = await findUser(db, session.user);

    if (!user) {
      return { success: false, error: 'User not found in database' };
    }

    return { 
      success: true, 
      data: {
        id: user.id || user._id?.toString(),
        name: user.name,
        email: user.email,
        image: user.image
      }
    };
  } catch (error) {
    console.error('Server action: Get profile error:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
};
