import { ENV } from "@/utils/env.ts";

interface DeleteActivitiesResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
}

interface DeleteActivitiesProps {
  token: string | null;
  id: number | null | undefined;
}

export const DeleteActivities = async ({
  token,
  id,
}: DeleteActivitiesProps): Promise<DeleteActivitiesResponse> => {
  console.log("Activities to delete:", id);
  try {
    const url = new URL("/api/activities", ENV.API_URL);
    let body = {
      ids: id,
    };

    console.log("Body:", body);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

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
      message: responseData.message || "Activities deleted successfully",
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
