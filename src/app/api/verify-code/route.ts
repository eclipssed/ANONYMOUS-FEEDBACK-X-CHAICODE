import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";


export async function POST(request: Request) {
  await dbConnect();
  try {
   const {username, code} = await request.json()
  } catch (error) {
    console.error("Error verifying code.", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code.",
      },
      {
        status: 500,
      }
    );
  }
}
