import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams }: any = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParam);
    // console.log(result)
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is available.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      {
        status: 500,
      }
    );
  }
}
