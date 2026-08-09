import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("Warning: RESEND_API_KEY environment variable is not defined.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "temp_key");
