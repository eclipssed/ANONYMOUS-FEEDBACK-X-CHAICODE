import { connect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse, userAgent } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { unstable_batchedUpdates } from "react-dom";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email, password }: any = await request.json();
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return NextResponse.json({ status: 400, messae: "user doesn't exist" });
    }
    
    const validPassowrd = await bcryptjs.compare(password, foundUser.password);
    if (!validPassowrd) {
      return NextResponse.json({ status: 400, message: "invalid credentials" });
    }
    const tokenData = {
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response =  NextResponse.json({
      status: 200,
      success: true,
      message: "logged in successfully",
    });

    response.cookies.set("token", token, { httpOnly: true, expires:  Date.now() + 360000 });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
