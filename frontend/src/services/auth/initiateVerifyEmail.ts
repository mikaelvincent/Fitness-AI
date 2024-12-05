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
        const url = new URL("/api/registration/initiate", ENV.API_URL);
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


        if (response.status === 429 && !response.ok) {
            return {
                success: false,
                message: responseData.message,
                status: response.status,
                retry_after: responseData.retry_after,
            };
        }

        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Registration initiation failed.",
                status: response.status,
            };
        }


        return {
            success: response.ok,
            message: responseData.message + " Please check your email",
            status: response.status,
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
