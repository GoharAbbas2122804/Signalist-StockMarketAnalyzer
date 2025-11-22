import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/better-auth/auth';
import { connectToDatabase } from '@/Database/mongoose';
import { Watchlist } from '@/Database/models/watchlist.model';

/**
 * Helper function to get session from request
 */
async function getSession(request: NextRequest) {
  const auth = await getAuth();
  return await auth.api.getSession({
    headers: request.headers
  });
}

/**
 * Helper function for unauthorized response
 */
function unauthorizedResponse() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

/**
 * Helper function to find user with flexible ID matching
 * Better Auth might use different ID field formats
 */
async function findUser(db: any, sessionUser: any) {
  // Log session user data for debugging
  console.log('Looking up user with session data:', {
    id: sessionUser.id,
    email: sessionUser.email
  });

  // Try multiple lookup strategies
  let user = null;

  // Strategy 1: Look up by id field (Better Auth default)
  user = await db.collection('user').findOne({ id: sessionUser.id });
  if (user) {
    console.log('User found by id field:', user.id);
    return user;
  }

  // Strategy 2: Look up by email (fallback)
  if (sessionUser.email) {
    user = await db.collection('user').findOne({ email: sessionUser.email.toLowerCase() });
    if (user) {
      console.log('User found by email:', user.email);
      return user;
    }
  }

  // Strategy 3: Look up by _id if session.user.id is an ObjectId string
  try {
    const { ObjectId } = require('mongodb');
    if (ObjectId.isValid(sessionUser.id)) {
      user = await db.collection('user').findOne({ _id: new ObjectId(sessionUser.id) });
      if (user) {
        console.log('User found by _id (ObjectId):', user._id);
        return user;
      }
    }
  } catch (error) {
    console.log('ObjectId lookup failed, continuing...');
  }

  console.error('User not found after all lookup strategies');
  return null;
}

/**
 * Helper function to update user with flexible ID matching
 */
async function updateUser(db: any, sessionUser: any, updateData: any) {
  // Try multiple update strategies
  let result = null;

  // Strategy 1: Update by id field
  result = await db.collection('user').updateOne(
    { id: sessionUser.id },
    { $set: updateData }
  );
  
  if (result.matchedCount > 0) {
    console.log('User updated by id field');
    return result;
  }

  // Strategy 2: Update by email
  if (sessionUser.email) {
    result = await db.collection('user').updateOne(
      { email: sessionUser.email.toLowerCase() },
      { $set: updateData }
    );
    
    if (result.matchedCount > 0) {
      console.log('User updated by email');
      return result;
    }
  }

  console.error('User update failed: no matching documents');
  return result;
}

/**
 * GET /api/profile - Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session?.user) {
      console.log('No session found');
      return unauthorizedResponse();
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      console.error('Database connection failed');
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    const user = await findUser(db, session.user);

    if (!user) {
      console.error('User not found for session:', session.user.id);
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: user.id || user._id?.toString(),
        name: user.name,
        email: user.email,
        image: user.image || null
      }
    });
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

/**
 * PUT /api/profile - Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session?.user) {
      console.log('No session found');
      return unauthorizedResponse();
    }

    const body = await request.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, currentPassword, newPassword, image } = body;
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      console.error('Database connection failed');
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    const updateData: any = { updatedAt: new Date() };

    // Validate and add fields to update
    if (name && typeof name === 'string' && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
      }
      
      // Only check for duplicates if email is actually changing
      const currentEmail = session.user.email?.toLowerCase();
      if (email.toLowerCase() !== currentEmail) {
        // Check if email is already taken by another user
        const existingUser = await db.collection('user').findOne({ 
          email: email.toLowerCase(),
          $and: [
            { $or: [
              { id: { $ne: session.user.id } },
              { id: { $exists: false } }
            ]},
            { email: email.toLowerCase() }
          ]
        });

        if (existingUser) {
          return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
        }
      }

      updateData.email = email.toLowerCase();
      updateData.emailVerified = false; // Mark email as unverified when changed
    }

    if (image !== undefined) {
      // Validate image is base64 or null
      if (image === null || (typeof image === 'string' && image.startsWith('data:image/'))) {
        updateData.image = image;
      } else {
        return NextResponse.json({ message: 'Invalid image format' }, { status: 400 });
      }
    }

    // Handle password update through Better Auth
    if (newPassword && currentPassword) {
      try {
        const auth = await getAuth();
        await auth.api.changePassword({
          body: {
            newPassword,
            currentPassword,
          },
          headers: request.headers
        });
        console.log('Password updated successfully');
      } catch (error: any) {
        console.error('Password update failed:', error);
        return NextResponse.json({ 
          message: error.message || 'Failed to update password. Please check your current password.' 
        }, { status: 400 });
      }
    }
    
    // Check if user exists before updating
    const existingUser = await findUser(db, session.user);
    
    if (!existingUser) {
      console.error('User not found in database:', session.user.id);
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    console.log('User found, proceeding with update');

    // Update user in database
    if (Object.keys(updateData).length > 1) { // More than just updatedAt
      console.log('Attempting update with data:', updateData);
      
      const result = await updateUser(db, session.user, updateData);
      
      console.log('Update result:', {
        matchedCount: result?.matchedCount,
        modifiedCount: result?.modifiedCount
      });

      if (!result || result.matchedCount === 0) {
        console.error('Update matched no documents');
        return NextResponse.json({ message: 'Failed to update user in database' }, { status: 500 });
      }
    }

    // Fetch updated user data
    const updatedUser = await findUser(db, session.user);

    if (!updatedUser) {
      console.error('Could not fetch updated user data');
      return NextResponse.json({ message: 'Profile update verification failed' }, { status: 500 });
    }

    console.log('Profile updated successfully');

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id || updatedUser._id?.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image || null
      }
    });
  } catch (error) {
    console.error('PUT /api/profile error:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}

/**
 * DELETE /api/profile - Delete user account and all associated data
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session?.user) {
      console.log('No session found');
      return unauthorizedResponse();
    }

    const body = await request.json().catch(() => null);
    
    // Require email confirmation
    if (!body?.confirmEmail || body.confirmEmail !== session.user.email) {
      return NextResponse.json({ 
        message: 'Email confirmation does not match' 
      }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      console.error('Database connection failed');
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    const userId = session.user.id;

    // Delete all watchlist items for this user
    await Watchlist.deleteMany({ userId });

    // Delete user sessions
    await db.collection('session').deleteMany({ userId });

    // Delete user account with flexible matching
    let result = await db.collection('user').deleteOne({ id: userId });
    
    // Fallback: try deleting by email
    if (result.deletedCount === 0 && session.user.email) {
      result = await db.collection('user').deleteOne({ email: session.user.email });
    }

    if (result.deletedCount === 0) {
      console.error('User not found for deletion');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Sign out the user
    const auth = await getAuth();
    await auth.api.signOut({ headers: request.headers });

    console.log('Account deleted successfully');

    return NextResponse.json({ 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('DELETE /api/profile error:', error);
    return NextResponse.json({ message: 'Failed to delete account' }, { status: 500 });
  }
}
