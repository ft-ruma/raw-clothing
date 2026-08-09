import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Auth guard — only admins/managers can upload
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "SUPER_ADMIN" && role !== "STORE_MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 10 MB" }, { status: 400 });
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.name || "image.jpg";
    const extension = path.extname(originalName) || ".jpg";
    // Sanitize extension to ensure it is safe
    const safeExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension.toLowerCase())
      ? extension
      : ".jpg";
    const filename = `${uniqueSuffix}${safeExtension}`;

    // Define local path in the public folder
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write file to public/uploads
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the relative URL from public root
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
