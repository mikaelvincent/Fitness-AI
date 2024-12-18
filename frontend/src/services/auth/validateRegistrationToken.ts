import { ENV } from "@/utils/env";

interface validateTokenResponse {
  success: boolean;
  message: string;
  status?: number;
}

export const validateRegistrationToken = async (
  token: string,
): Promise<validateTokenResponse> => {
  try {
    const url = new URL("/api/registration/validate-token", ENV.API_URL);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ token }),
    });

    const responseData = await response.json();

    if (!response.ok && response.status === 400) {
      return {
        success: false,
        status: response.status,
        message: responseData.message || "Invalid token or token expired.",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: responseData.message,
      };
    }

    return {
      success: true,
      status: response.status,
      message: responseData.message || "Token is valid.",
    };
  } catch (error) {
    console.error("Registration Token Validation error:", error);
    return {
      success: false,
      status: 500,
      message: "An error occurred during token validation.",
    };
  }
};
