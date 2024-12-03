import {ENV} from "@/utils/env";
import {z} from "zod";
import {VerifyEmailSchema} from "@/utils/schema/VerifyEmailSchema.ts";

interface InitiateVerifyEmailResponse {
    success: boolean;
    message: string;
    status?: number;
    errors?: string | null;
    retry_after?: number;
}


export const initiateVerifyEmail = async (data: z.infer<typeof VerifyEmailSchema>): Promise<InitiateVerifyEmailResponse> => {
    try {
        const url = new URL("/api/register/initiate", ENV.API_URL);
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
                message: primaryErrorKey,
                errors: responseData.errors[primaryErrorKey] || "Registration initiation failed. The email has already been taken",
                status: response.status,
            };
        }

        if (response.status === 429 && !response.ok) {
            return {
                success: false,
                message: responseData.message,
                status: response.status,
                retry_after: responseData.retry_after,
            };
        }


        return {
            success: response.ok,
            message: responseData.message + " Please check your email.",
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
