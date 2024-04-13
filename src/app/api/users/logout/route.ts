import { connect } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse, userAgent } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { unstable_batchedUpdates } from "react-dom";
import jwt from "jsonwebtoken";

connect();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      status: 200,
      success: true,
      message: "logged out successfully",
    });

    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
