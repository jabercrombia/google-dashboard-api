import { NextResponse } from "next/server";

type AuthRequestBody = {
  password: string;
};

export async function POST(req: Request) {
  try {
    // Log incoming request body for debugging
    const { password }: AuthRequestBody = await req.json();
    console.log("Received password:", password); // Log the received password

    // Log the environment variable for debugging
    const correctPassword = process.env.PASSWORD;
    console.log("Environment password:", correctPassword); // Log the password from .env

    if (!correctPassword) {
      return NextResponse.json({ error: "Server misconfiguration: PASSWORD not found" }, { status: 500 });
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
