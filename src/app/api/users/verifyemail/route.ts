import { connect } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      
      return NextResponse.json({ status: 400, error: "invlaid token" });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
