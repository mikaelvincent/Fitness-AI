// frontend/src/services/exercises/AddorUpdateActivities.tsx

import { ENV } from "@/utils/env.ts";
import { Exercise } from "@/types/exerciseTypes.ts";

interface AddOrUpdateActivitiesResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
}

interface AddOrUpdateActivitiesProps {
  token: string | null;
  activities: Exercise;
}

export const UpdateOrAddActivity = async ({
  token,
  activities,
}: AddOrUpdateActivitiesProps): Promise<AddOrUpdateActivitiesResponse> => {
  try {
    console.log("Activities to submit:", activities);

    const data = {
      activities: {
        id: activities.id,
        name: activities.name,
        description: activities.description,
        completed: activities.completed,
        notes: activities.notes,
        metrics: activities.metrics,
        parent_id: activities.parent_id,
        date: activities.date?.toISOString(),
        position: activities.position,
      },
    };

    const url = new URL("/api/activities", ENV.API_URL);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
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
      message:
        responseData.message || "Activities added or updated successfully",
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
