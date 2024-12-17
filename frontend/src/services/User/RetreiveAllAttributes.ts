import { ENV } from "@/utils/env.ts";
import { logout } from "@/services/auth/authService.ts";

interface RetrieveAttributesResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
  data?: object;
}

interface RetrieveAttributesProps {
  token: string | null;
}

export const RetrieveAttributes = async ({
  token,
}: RetrieveAttributesProps): Promise<RetrieveAttributesResponse> => {
  try {
    const url = new URL("/api/user/attributes", ENV.API_URL);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const responseData = await response.json();

    console.log(response);
    console.log("Response data:", responseData);

    if (!response.ok && response.status === 429) {
      return {
        success: false,
        message: responseData.message || "Too many requests. Try again later.",
        status: response.status,
        retry_after: responseData.retry_after,
      };
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Trigger logout if unauthorized
        logout();
      }
      return {
        success: false,
        message: responseData.message,
        status: response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Attributes retrieved successfully",
      status: response.status,
      data: responseData.data,
    };
  } catch (error) {
    console.log("Error during submission:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
