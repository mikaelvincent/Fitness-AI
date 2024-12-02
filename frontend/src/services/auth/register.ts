import {ENV} from "@/utils/env";

interface RegisterResponse {
    success: boolean;
    message: string;
    status?: number;
    token?: string;
    errors?: string | null;
    retry_after?: number;
    errorKey?: string;
}

interface RegisterDataProps {
    token: string;
    name: string;
    password: string;
    password_confirmation: string;
}


export const registerUser = async (data: RegisterDataProps): Promise<RegisterResponse> => {
    try {
        console.log("Registering user with data:", data);
        const url = new URL("/api/register", ENV.API_URL);
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

        console.log("Registration Response data:", responseData);

        if (!response.ok || response.status === 429) {
            return {
                success: !response.ok,
                message: responseData.message,
                status: response.status,
                retry_after: responseData.retry_after,
            };
        }

        if (!response.ok) {
            // Assuming the backend sends validation errors in a specific format
            const errorKeys = Object.keys(responseData.errors);
            const primaryErrorKey = errorKeys[0] || "others";
            return {
                success: false,
                message: primaryErrorKey,
                errors: responseData.errors[primaryErrorKey] || "Registration failed. Please try again.",
                errorKey: primaryErrorKey,
                status: response.status,
            };
        }


        return {
            success: true,
            message: responseData.message || "Registration successful!",
            token: responseData.data.token,
        };

    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
            status: 500,
        };
    }
};
