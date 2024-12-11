import * as z from "zod";

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, {
      message: "Please enter your current password",
    }),
    password: z.string().min(1, {
      message: "Please enter your new password",
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"], // Points to the confirmPassword field
    message: "Passwords must match",
  });
