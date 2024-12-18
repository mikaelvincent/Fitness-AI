import { ENV } from "@/shared/utils/env";
import { logout } from "@/features/authentication/services/authService";

interface UpdateNameResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
  data?: object;
}

interface UpdateNameProps {
  token: string | null;
  name: string;
}

export const UpdateName = async ({
  token,
  name,
}: UpdateNameProps): Promise<UpdateNameResponse> => {
  try {
    const url = new URL("/api/user/profile/name", ENV.API_URL);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ name }),
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
      message: responseData.message || "Name Updated successfully",
      status: response.status,
      data: responseData.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
