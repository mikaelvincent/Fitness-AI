import * as z from "zod";

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, {
        message: "Please enter a valid email address",
    }),
    email: z.string().email({
        message: "Enter a password",
    }),
    password: z.string().min(1, {
        message: "Please enter a password",
    }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"], // Points to the confirmPassword field
    message: "Passwords must match",
});
