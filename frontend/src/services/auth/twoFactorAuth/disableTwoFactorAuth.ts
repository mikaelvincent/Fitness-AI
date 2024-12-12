import { ENV } from "@/utils/env";

interface DisableTwoFactorAuthResponse {
  success: boolean;
  message: string;
  status?: number;
  retry_after?: number;
}

export const DisableTwoFactorAuth = async (
  token: string | null,
): Promise<DisableTwoFactorAuthResponse> => {
  try {
    const url = new URL("/api/two-factor/disable", ENV.API_URL);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
    });

    const responseData = await response.json();

    console.log("Response data:", responseData);

    if (!response.ok && response.status === 429) {
      return {
        success: false,
        message: responseData.message || "Please try again after a while.",
        status: response.status,
        retry_after: responseData.retry_after || 60,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          responseData.message ||
          "Failed to deactivate two factor Authentication",
        status: response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Two factor Authentication Deactivated",
      status: response.status,
    };
  } catch (error) {
    console.log("Error during activation:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
