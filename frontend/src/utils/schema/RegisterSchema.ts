import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Enter your full name",
    }),
    password: z.string().min(1, { message: "Enter a password" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"], // Points to the confirmPassword field
    message: "Passwords must match",
  });
