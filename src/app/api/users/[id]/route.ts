import { NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/utils/storage';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = getUserById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedUser = updateUser(id, body);
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedUser });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}
