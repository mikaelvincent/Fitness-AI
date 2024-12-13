import { ENV } from "@/utils/env.ts";

interface RetrieveActivitiesResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
  data?: object;
}

interface RetrieveActivitiesProps {
  token: string | null;
  date: Date;
}

export const RetrieveActivities = async ({
  token,
  date,
}: RetrieveActivitiesProps): Promise<RetrieveActivitiesResponse> => {
  try {
    const formattedDate = date.toISOString().split("T")[0];

    const url = new URL("/api/activities", ENV.API_URL);
    url.searchParams.append("from_date", formattedDate);
    url.searchParams.append("to_date", formattedDate);
    url.searchParams.append("nested", "true"); // Include if needed

    console.log("URL:", url);

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
      message: responseData.message || "Activities retrieved successfully",
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
