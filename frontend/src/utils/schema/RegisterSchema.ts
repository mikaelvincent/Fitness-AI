import * as z from "zod";

export const RegisterSchema = z
  .object({
    fullName: z.string().min(1, {
      message: "Full name must be at least 1 character",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Points to the confirmPassword field
    message: "Passwords must match",
  });
