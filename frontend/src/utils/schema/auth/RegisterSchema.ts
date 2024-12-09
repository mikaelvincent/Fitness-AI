import * as z from "zod";

export const RegisterSchema = z
    .object({
        name: z.string().min(1, {
            message: "Enter your full name",
        }),
        password: z.string().min(1, {message: "Enter a password"}),
        // .refine(
        //   (value) =>
        //     value.length >= 8 &&
        //     /[A-Z]/.test(value) &&
        //     /[a-z]/.test(value) &&
        //     /[0-9]/.test(value),
        //   {
        //     message:
        //       "Password must be at least 8 characters long and contain at least one capitalized letter, one lowercase letter, and one number",
        //   }
        // )
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"], // Points to the confirmPassword field
        message: "Passwords must match",
    });
