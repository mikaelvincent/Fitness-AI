import * as z from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(1, {
      message: "Please enter a password",
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords must match",
  });
