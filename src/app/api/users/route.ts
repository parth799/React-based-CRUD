import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/utils/storage';

export async function GET() {
  try {
    const users = getUsers();
    return NextResponse.json({ success: true, data: users });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = createUser(body);
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}
