import { ENV } from "@/utils/env";
import { RegisterSchema } from "@/utils/schema/RegisterSchema";

export const registerUser = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    console.log("Registering user with data:", data);
    const url = new URL("/api/register", ENV.API_URL);
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

    if (response.status === 201 && response.ok) {
      return {
        success: true,
        message: responseData.message,
        data: responseData.data,
      };
    } else if (response.status === 422 && !response.ok) {
      return {
        success: false,
        message: responseData.message,
        errors: responseData.errors, // Return all validation errors
      };
    } else if (response.status === 500) {
      return {
        success: false,
        message: "Internal server error",
        errors: "Registration failed. Please try again.",
      };
    } else {
      // Handle other unexpected statuses
      throw new Error(
        `Unexpected HTTP error! Status: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      errors: null,
    };
  }
};
