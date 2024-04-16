import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/models/user.model";
// import User from "@/models/user.model";
// import { Message } from "@/models/user.model";

export async function POST(request: NextRequest) {
  dbConnect();
  try {
    const { username, email, password }: any = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return NextResponse.json({
        status: 400,
        success: false,
        error: "Username is already taken.",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json({
          status: 400,
          message: "User already exists with this email.",
          success: false,
        });
      } else {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        (existingUserByEmail.password = hashedPassword),
          (existingUserByEmail.verifyCode = verifyCode),
          (existingUserByEmail.verifyCodeExpiry = new Date(
            Date.now() + 3600000
          ));
        await existingUserByEmail.save();
      }
    } else {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return NextResponse.json({
        status: 500,
        message: emailResponse.message,
        success: false,
      });
    }

    return NextResponse.json({
      status: 200,
      sucess: true,
      message:
        "User created successfully. Please verify your email to claim your username.",
    });
  } catch (error: any) {
    console.log("error registering user.");
    return NextResponse.json({
      status: 500,
      success: false,
      message: "error reegistering user.",
      error: error.message,
    });
  }
}
