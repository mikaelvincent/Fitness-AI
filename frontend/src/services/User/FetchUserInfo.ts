// src/services/User/FetchUserInfo.ts
import { ENV } from "@/utils/env.ts";
import { logout } from "@/services/auth/authService.ts";

// Define the response interfaces
interface FetchUserInfoResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
  data?: object;
}

interface FetchUserInfoProps {
  token: string | null;
}

export const FetchUserInfo = async ({
  token,
}: FetchUserInfoProps): Promise<FetchUserInfoResponse> => {
  if (!token) {
    return {
      success: false,
      message: "No authentication token provided.",
      status: 401,
    };
  }

  try {
    const url = new URL("/api/user/profile", ENV.API_URL);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: headers,
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          message:
            responseData.message || "Too many requests. Try again later.",
          status: response.status,
          retry_after: responseData.retry_after,
        };
      }

      if (response.status === 401) {
        // Trigger logout if unauthorized
        logout();
      }
      return {
        success: false,
        message: responseData.message || "Failed to fetch user information.",
        status: response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Fetched user information successfully.",
      status: response.status,
      data: {
        name: responseData.name,
        email: responseData.email,
      },
    };
  } catch (error) {
    console.error("Error during FetchUserInfo:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
