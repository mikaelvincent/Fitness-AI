import { ENV } from "@/shared/utils/env";

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  status?: number;
  retry_after?: number;
}

interface ResetPasswordDataProps {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const SendResetPasswordRequest = async (
  data: ResetPasswordDataProps,
): Promise<ResetPasswordResponse> => {
  try {
    const url = new URL("/api/password/reset", ENV.API_URL);
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

    if (!response.ok && response.status === 429) {
      return {
        success: false,
        message: responseData.message || "Too many requests. Try again later.",
        status: response.status,
        retry_after: responseData.retry_after,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message,
        status: response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Reset Password Successful",
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
