import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Enter a password",
  }),
  two_factor_code: z
    .string()
    .min(1, {
      message: "Enter a code",
    })
    .optional(),
});
