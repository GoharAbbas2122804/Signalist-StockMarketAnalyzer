import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/utils/adminAuth';
import { getAuditLogs } from '@/lib/actions/admin.actions';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdminSession();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action') || undefined;

    const result = await getAuditLogs({
      page,
      limit,
      action: action as any
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Admin audit logs API error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
