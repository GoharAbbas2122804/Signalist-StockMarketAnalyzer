'use server';

import { connectToDatabase } from '@/Database/mongoose';
import { User, UserRole } from '@/Database/models/user.model';
import { AuditLog, AuditAction } from '@/Database/models/auditLog.model';
import { requireAdminSession, getRequestMetadata } from '@/lib/utils/adminAuth';
import { revalidatePath } from 'next/cache';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  includeDeleted?: boolean;
}

interface UserListResponse {
  users: any[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Get paginated list of users for admin dashboard
 */
export async function getUsersForAdmin(params: PaginationParams = {}): Promise<UserListResponse> {
  try {
    const session = await requireAdminSession();
    await connectToDatabase();

    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      includeDeleted = false
    } = params;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (!includeDeleted) {
      query.deletedAt = null;
    }

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute queries
    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      User.countDocuments(query)
    ]);

    return {
      users: users.map(user => ({
        ...user,
        _id: user._id.toString(),
        id: user._id.toString()
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  try {
    const session = await requireAdminSession();
    await connectToDatabase();

    // Prevent admin from removing their own admin role
    if (session.user.id === userId && newRole !== UserRole.ADMIN) {
      throw new Error('Cannot remove your own admin privileges');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    // Create audit log
    const metadata = await getRequestMetadata();
    await AuditLog.create({
      adminId: session.user.id,
      adminEmail: session.user.email,
      action: AuditAction.ROLE_CHANGE,
      targetUserId: userId,
      targetUserEmail: user.email,
      metadata: {
        oldRole,
        newRole
      },
      ...metadata
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin/dashboard');
  } catch (error: any) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }
}

/**
 * Soft delete user (admin only)
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    const session = await requireAdminSession();
    await connectToDatabase();

    // Prevent admin from deleting themselves
    if (session.user.id === userId) {
      throw new Error('Cannot delete your own account');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.deletedAt) {
      throw new Error('User is already deleted');
    }

    // Soft delete
    user.deletedAt = new Date();
    await user.save();

    // Create audit log
    const metadata = await getRequestMetadata();
    await AuditLog.create({
      adminId: session.user.id,
      adminEmail: session.user.email,
      action: AuditAction.USER_DELETE,
      targetUserId: userId,
      targetUserEmail: user.email,
      metadata: {
        email: user.email,
        role: user.role
      },
      ...metadata
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin/dashboard');
  } catch (error: any) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Restore soft-deleted user (admin only)
 */
export async function restoreUser(userId: string): Promise<void> {
  try {
    const session = await requireAdminSession();
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.deletedAt) {
      throw new Error('User is not deleted');
    }

    user.deletedAt = undefined;
    await user.save();

    // Create audit log
    const metadata = await getRequestMetadata();
    await AuditLog.create({
      adminId: session.user.id,
      adminEmail: session.user.email,
      action: AuditAction.USER_RESTORE,
      targetUserId: userId,
      targetUserEmail: user.email,
      metadata: {
        email: user.email,
        role: user.role
      },
      ...metadata
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin/dashboard');
  } catch (error: any) {
    throw new Error(`Failed to restore user: ${error.message}`);
  }
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics() {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsers7Days,
      newUsers30Days,
      adminCount,
      userCount,
      guestCount
    ] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ deletedAt: null, lastLoginAt: { $gte: last30Days } }),
      User.countDocuments({ deletedAt: null, createdAt: { $gte: last7Days } }),
      User.countDocuments({ deletedAt: null, createdAt: { $gte: last30Days } }),
      User.countDocuments({ deletedAt: null, role: UserRole.ADMIN }),
      User.countDocuments({ deletedAt: null, role: UserRole.USER }),
      User.countDocuments({ deletedAt: null, role: UserRole.GUEST })
    ]);

    // Get user growth data for chart (last 30 days)
    const userGrowthData = await User.aggregate([
      {
        $match: {
          deletedAt: null,
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return {
      totalUsers,
      activeUsers,
      newUsers7Days,
      newUsers30Days,
      adminCount,
      userCount,
      guestCount,
      roleDistribution: {
        admin: adminCount,
        user: userCount,
        guest: guestCount
      },
      userGrowth: userGrowthData.map(item => ({
        date: item._id,
        count: item.count
      }))
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch dashboard metrics: ${error.message}`);
  }
}

/**
 * Get audit logs
 */
export async function getAuditLogs(params: { page?: number; limit?: number; action?: AuditAction } = {}) {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const { page = 1, limit = 20, action } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (action) {
      query.action = action;
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    return {
      logs: logs.map(log => ({
        ...log,
        _id: log._id.toString(),
        id: log._id.toString()
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }
}
