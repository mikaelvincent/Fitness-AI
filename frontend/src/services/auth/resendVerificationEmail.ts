import {ENV} from "@/utils/env";
import {z} from "zod";
import {VerifyEmailSchema} from "@/utils/schema/VerifyEmailSchema.ts";

interface ResendVerificationEmailResponse {
    success: boolean;
    message: string;
    status?: number;
    errors?: string | null;
    retry_after?: number;
}

export const resendVerificationEmail = async (data: z.infer<typeof VerifyEmailSchema>): Promise<ResendVerificationEmailResponse> => {
    try {
        const url = new URL("/api/register/resend", ENV.API_URL);
        const headers: HeadersInit = {
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

        if (response.status === 422 && !response.ok) {
            // Assuming the backend sends validation errors in a specific format
            const errorKeys = Object.keys(responseData.errors);
            const primaryErrorKey = errorKeys[0] || "others";
            return {
                success: false,
                message: responseData.message,
                errors: responseData.errors[primaryErrorKey],
                status: response.status,
            };
        }

        if (response.status === 429 && !response.ok) {
            return {
                success: false,
                message: responseData.message || "Too many requests. Please try again later.",
                status: response.status,
                retry_after: responseData.retry_after,
            };
        }


        return {
            success: response.ok,
            message: responseData.message || "Verification email resent successfully!",
        };
    } catch (error) {
        console.error("Error during submission:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
            status: 500,
        };
    }
};
