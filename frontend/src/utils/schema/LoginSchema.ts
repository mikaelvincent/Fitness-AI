// src/utils/schema/LoginSchema.ts

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Please enter your password"),
  two_factor_code: z.string().optional(),
});

// Schema when 2FA code is required
export const LoginSchemaWith2FA = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Please enter your password"),
  two_factor_code: z.string().min(1, "Verification code must be 1 digits"),
});
