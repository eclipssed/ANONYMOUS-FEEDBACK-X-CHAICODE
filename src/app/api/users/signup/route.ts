import { connect } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password }: any = await request.json();

    const userFound = await User.findOne({ email });
    if (userFound) {
      return NextResponse.json({ status: 400, error: "User already exists" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    // console.log(savedUser);

    // send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    return NextResponse.json({
      status: 200,
      sucess: true,
      message: "User created successfully",
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
