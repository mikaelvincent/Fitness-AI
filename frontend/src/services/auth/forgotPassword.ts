import {ENV} from "@/utils/env";
import {ForgotPasswordSchema} from "@/utils/schema/ForgotPasswordSchema.ts";
import {z} from "zod";

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    status?: number;
    errors?: string | null;
}

export const ForgotPasswordSendEmail = async (data: z.infer<typeof ForgotPasswordSchema>): Promise<ForgotPasswordResponse> => {
    console.log("ForgotPasswordSendEmail data:", data);
    try {
        const url = new URL("/api/forgot-password", ENV.API_URL);
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        console.log("Response data:", responseData);

        if (!response.ok && response.status === 422) {
            const errorKeys = Object.keys(responseData.errors);
            const primaryErrorKey = errorKeys[0] || "others";
            return {
                success: response.ok,
                message: primaryErrorKey,
                errors: responseData.errors[primaryErrorKey] || "The email must be a valid email address.",
                status: response.status,
            };
        }

        if (!response.ok) {
            return {
                success: response.ok,
                message: responseData.message || "Unable to send password reset link.",
                status: response.status,
            };
        }

        return {
            success: true,
            message: responseData.message || "Login successful!",
            status: response.status,
        };

    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
            status: 500,
        };
    }
};
