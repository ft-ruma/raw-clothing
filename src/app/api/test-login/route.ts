import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await signIn("credentials", {
      email: "admin@rawclothing.com",
      password: "admin123",
      redirect: false,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message, 
      type: err.type,
      name: err.name,
      stack: err.stack
    });
  }
}
