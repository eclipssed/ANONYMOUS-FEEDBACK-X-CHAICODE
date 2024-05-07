import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  if (!session || !_user) {
    return Response.json({
      success: false,
      message: "Not authenticated.",
      status: 401,
    });
  }
  const userId = new mongoose.Types.ObjectId(_user?._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json({
        success: false,
        message: "User not found.",
        status: 404,
      });
    }

    return Response.json({
      success: true,
      messages: user[0].messages,
      status: 200,
    });
  } catch (error) {
    console.log("Error while getting messages. ", error);
    return Response.json({
      success: false,
      message: "Error while getting messages.",
      status: 500,
    });
  }
}
