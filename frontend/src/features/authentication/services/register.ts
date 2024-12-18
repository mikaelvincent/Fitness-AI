import { ENV } from "@/shared/utils/env";

interface RegisterResponse {
  success: boolean;
  message: string;
  status?: number;
  token?: string;
  errors?: string;
  retry_after?: number;
  errorKey?: string;
}

interface RegisterDataProps {
  token: string;
  name: string;
  password: string;
  password_confirmation: string;
}

export const registerUser = async (
  data: RegisterDataProps,
): Promise<RegisterResponse> => {
  try {
    const url = new URL("/api/registration/complete", ENV.API_URL);
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
      console.warn(
        "Rate limit exceeded. Retry after:",
        responseData.retry_after,
      );
      return {
        success: false,
        message:
          responseData.message || "Too many attempts. Please try again later.",
        status: response.status,
        retry_after: Number(responseData.retry_after) || 60, // Ensure it's a number
      };
    }

    if (!response.ok) {
      console.error("Registration failed with errors:", responseData.errors);
      const errorKeys = responseData.errors
        ? Object.keys(responseData.errors)
        : [];
      const primaryErrorKey = errorKeys[0] || "others";
      return {
        success: false,
        message: responseData.message || "Registration failed.",
        errors: responseData.errors
          ? responseData.errors[primaryErrorKey]
          : "An unexpected error occurred.",
        errorKey: primaryErrorKey,
        status: response.status,
      };
    }

    console.log("Registration successful:", responseData);
    return {
      success: true,
      message: responseData.message || "Registration successful!",
      token: responseData.data.token, // Adjust based on actual response structure
      status: response.status,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
