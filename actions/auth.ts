"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import AuthError from "next-auth";

export async function registerUser(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password?: string;
}) {
  try {
    // Step 1 — Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Step 2 — Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Step 3 — Save user to database (only DB fields, no confirm_password)
    await db.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { success: true };

  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}
export async function loginUser(data: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/",
    });

    return { success: true };

  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error; // 👈 this allows the redirect to work
  }
}