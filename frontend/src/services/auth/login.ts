import {ENV} from "@/utils/env";
import {LoginSchema} from "@/utils/schema/LoginSchema";
import {z} from "zod";
import User from "@/hooks/context/UserContext";

interface LoginResponse {
    success: boolean;
    message: string;
    status?: number;
    data?: User;
    token?: string;
    retry_after?: number;
}

export const loginUser = async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    try {
        const url = new URL("/api/login", ENV.API_URL);
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
            return {
                success: false,
                message: responseData.message || "Too many attempts. Please try again later.",
                status: response.status,
                retry_after: responseData.retry_after,
            };
        }

        if (!response.ok) {
            return {
                success: response.ok,
                message: responseData.message,
                status: response.status,
            };
        }

        return {
            success: true,
            message: responseData.message || "Login successful!",
            data: {name: responseData.data.user.name},
            token: responseData.data.token,
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
