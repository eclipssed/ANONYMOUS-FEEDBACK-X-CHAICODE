import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string,
): Promise<apiResponse> {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Freelance Ready Project Verification Code.',
      react: VerificationEmail({username, otp}),
    });
    
    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.log("Error sending verification email.");
    return { success: false, message: "failed to send verification email" };
  }
}
