import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 character.")
  .max(20, "username should contain less than 20 characters.")
  .regex(
    /^[a-zA-Z0-9]+$/,
    "username shouldn't contain any special characters."
  );

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleas 6 characters." })
    .max(15, { message: "Password must be less than 15 characters." }),
});
