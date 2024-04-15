import { connect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { getDataFromToken } from "@/lib/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
   
    const userId = await getDataFromToken(request);
   
    const user = await User.findById({ _id: userId }).select("-password");
    if (!user) {
      console.log("user not found")
      return NextResponse.json({
        status: 400,
        error: "Couldn't find userData.",
      });
    }
    console.log("user found")
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Found the user",
      data: user
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
