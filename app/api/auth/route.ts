// app/api/auth/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Extract the password from the request body
    const { password } = await req.json();

    const storedPassword = process.env.PASSWORD; // Store the password securely in your .env file

    if (password === storedPassword) {
      return NextResponse.json({ message: 'Authenticated' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in authentication:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
