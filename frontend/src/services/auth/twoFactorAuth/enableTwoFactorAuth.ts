import { ENV } from "@/utils/env";
import { logout } from "@/services/auth/authService.ts";

export interface twoFactorAuthData {
  qr_code_url: string;
  recovery_codes: string[];
}

export interface EnableTwoFactorAuthResponse {
  success: boolean;
  message: string;
  status?: number;
  retry_after?: number;
  data?: twoFactorAuthData;
}

export const EnableTwoFactorAuth = async (
  token: string | null,
): Promise<EnableTwoFactorAuthResponse> => {
  try {
    const url = new URL("/api/two-factor/enable", ENV.API_URL);
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
      if (response.status === 401) {
        // Trigger logout if unauthorized
        logout();
      }
      return {
        success: false,
        message:
          responseData.message ||
          "Failed to activate two factor Authentication",
        status: response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Two factor Authentication Activated",
      status: response.status,
      data: responseData.data,
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
