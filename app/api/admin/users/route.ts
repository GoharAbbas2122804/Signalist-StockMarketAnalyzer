import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/utils/adminAuth';
import { getUsersForAdmin } from '@/lib/actions/admin.actions';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdminSession();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || undefined;
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const result = await getUsersForAdmin({
      page,
      limit,
      search,
      role: role as any,
      includeDeleted
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Admin users API error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
