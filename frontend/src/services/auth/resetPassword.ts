import {ENV} from "@/utils/env";

interface ResetPasswordResponse {
    success: boolean;
    message: string;
    status?: number;
    errors?: string | null;
}

interface ResetPasswordDataProps {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const SendResetPasswordRequest = async (data: ResetPasswordDataProps): Promise<ResetPasswordResponse> => {
    console.log("SendResendPasswordRequest data:", data);
    try {
        const url = new URL("/api/reset-password", ENV.API_URL);
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
                errors: responseData.errors[primaryErrorKey] || "The password must be at least 8 characters.",
                status: response.status,
            };
        }

        if (!response.ok) {
            return {
                success: response.ok,
                message: responseData.message || "Unable to reset password.",
                status: response.status,
            };
        }


        return {
            success: true,
            message: responseData.message || "Reset Password Successful",
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
