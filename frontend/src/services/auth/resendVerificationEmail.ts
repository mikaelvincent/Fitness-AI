import {ENV} from "@/utils/env";

interface ResendVerificationEmailResponse {
    success: boolean;
    message: string;
    status?: number;
    data?: any;
}

export const resendVerificationEmail = async (token?: string): Promise<ResendVerificationEmailResponse> => {
    const url = new URL("/api/email/verification-notification", ENV.API_URL);
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }


    const response = await fetch(url, {
        method: "POST",
        headers: headers,
    });

    const responseData = await response.json();

    console.log("Response data:", responseData);

    if (!response.ok) {
        return {
            success: response.ok,
            message: responseData.message,
            status: response.status,
        };
    }

    if (response.status === 200 && response.ok) {
        return {
            success: response.ok,
            message: responseData.message,
            data: responseData.data,
        };
    }

    return {
        success: false,
        message: "An unexpected error occurred.",
        data: null,
    };
};
