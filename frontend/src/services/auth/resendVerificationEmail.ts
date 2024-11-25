import { ENV } from "@/utils/env";

export const resendVerificationEmail = async () => {
  const url = new URL("/api/email/verification-notification", ENV.API_URL);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  const responseData = await response.json();

  console.log("Response data:", responseData);

  if (!response.ok) {
    return {
      success: response.ok,
      message: responseData.message,
      status: response.status,
    };
  }

  if (response.status === 200 && response.ok) {
    return {
      success: response.ok,
      message: responseData.message,
      data: responseData.data,
    };
  }
};
