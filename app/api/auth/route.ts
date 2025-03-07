import { NextResponse } from "next/server";

type AuthRequestBody = {
  password: string;
};

export async function POST(req: Request) {
  try {
    const { password }: AuthRequestBody = await req.json();
    const correctPassword = process.env.PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
