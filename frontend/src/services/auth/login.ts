import { ENV } from "@/utils/env";
import { LoginSchema } from "@/utils/schema/LoginSchema";

export const loginUser = async (data: z.infer<typeof LoginSchema>) => {
  const url = new URL("/api/login", ENV.API_URL);
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

  console.log("Response data:", responseData);

  if (!response.ok && response.status !== 429) {
    return {
      success: response.ok,
      message: responseData.message,
      status: response.status,
    };
  }

  if (!response.ok && response.status === 429) {
    return {
      success: response.ok,
      message: responseData.message,
      status: response.status,
      retry_after: responseData.retry_after,
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
