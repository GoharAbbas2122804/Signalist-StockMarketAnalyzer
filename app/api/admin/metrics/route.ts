import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/utils/adminAuth';
import { getDashboardMetrics } from '@/lib/actions/admin.actions';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdminSession();

    const metrics = await getDashboardMetrics();

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Admin metrics API error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
