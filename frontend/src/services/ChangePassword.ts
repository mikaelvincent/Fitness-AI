import { ENV } from "@/utils/env";
import { ChangePasswordSchema } from "@/utils/schema/ChangePasswordSchema.ts";
import { z } from "zod";

interface ChangePasswordRequestResponse {
  success: boolean;
  message: string;
  status?: number;
  retry_after?: number;
}

interface ChangePasswordRequestDataProps {
  token: string | null;
  data: z.infer<typeof ChangePasswordSchema>;
}

export const ChangePasswordRequest = async ({
  token,
  data,
}: ChangePasswordRequestDataProps): Promise<ChangePasswordRequestResponse> => {
  try {
    const url = new URL("/api/password/change", ENV.API_URL);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
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
      return {
        success: false,
        message: responseData.message,
        status: response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Change Password Successful",
      status: response.status,
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
