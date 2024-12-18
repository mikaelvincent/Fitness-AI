import { ENV } from "@/utils/env";

interface LogoutResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
}

export const logoutUser = async (
  token: string | null,
): Promise<LogoutResponse> => {
  try {
    const url = new URL("/api/logout", ENV.API_URL);
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

    if (!response.ok && response.status === 429) {
      return {
        success: false,
        message:
          responseData.message || "Too many attempts. Please try again later.",
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
      message: responseData.message || "Login successful!",
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
