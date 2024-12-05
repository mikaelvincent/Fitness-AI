import {ENV} from "@/utils/env";
import {ForgotPasswordSchema} from "@/utils/schema/ForgotPasswordSchema.ts";
import {z} from "zod";

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    status?: number;
    errors?: string | null;
    retry_after?: number;
}

export const ForgotPasswordSendEmail = async (data: z.infer<typeof ForgotPasswordSchema>): Promise<ForgotPasswordResponse> => {
    console.log("ForgotPasswordSendEmail data:", data);
    try {
        const url = new URL("/api/password/forgot", ENV.API_URL);
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

        if (!response.ok && response.status === 429) {
            const errorKeys = Object.keys(responseData.errors);
            const primaryErrorKey = errorKeys[0] || "others";
            return {
                success: response.ok,
                message: primaryErrorKey,
                status: response.status,
                retry_after: responseData.retry_after || 60,
            };
        }

        if (!response.ok) {
            const errorKeys = Object.keys(responseData.errors);
            const primaryErrorKey = errorKeys[0] || "others";
            return {
                success: response.ok,
                message: primaryErrorKey,
                errors: responseData.errors[primaryErrorKey] || "Unable to send password reset link.",
                status: response.status,
            };
        }

        return {
            success: true,
            message: responseData.message || "Your request has been received. If your email is registered, you will receive a password reset link shortly.",
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
