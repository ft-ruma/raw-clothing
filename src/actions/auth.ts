"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin", // Default redirect, can be adjusted based on role later
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function register(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
      return { error: "Missing fields" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return { success: "Account created successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create account" };
  }
}
