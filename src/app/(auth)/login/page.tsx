"use client";

import { login } from "@/actions/auth";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">RAW Clothing</h1>
        <p className="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-black font-semibold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
