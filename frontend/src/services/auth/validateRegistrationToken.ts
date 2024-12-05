import {ENV} from "@/utils/env";

interface validateTokenResponse {
    success: boolean;
    message: string;
    status?: number;
    valid?: string;
    errors?: string;
}

export const validateRegistrationToken = async (token: string): Promise<validateTokenResponse> => {
    try {
        const url = new URL("/api/register/validate-token", ENV.API_URL);
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({token}),
        });

        const responseData = await response.json();

        console.log("Registration Token Validation Response data:", responseData);

        if (!response.ok && response.status === 400) {
            return {
                success: false,
                status: response.status,
                message: responseData.message || "Invalid token or token expired.",
                valid: responseData.data.status,
            };
        }

        if (!response.ok) {
            const errorKeys = Object.keys(responseData.errors);
            const primaryErrorKey = errorKeys[0] || "others";
            return {
                success: false,
                status: response.status,
                message: primaryErrorKey,
                errors: responseData.errors[primaryErrorKey] || "Validation failed. Please try again.",
                valid: responseData.status,
            };
        }

        return {
            success: true,
            status: response.status,
            message: responseData.message || "Token is valid.",
            valid: responseData.data.status
        };

    } catch (error) {
        console.error("Registration Token Validation error:", error);
        return {
            success: false,
            status: 500,
            message: "An error occurred during token validation.",
        }
    }
}