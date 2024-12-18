// frontend/src/services/exercises/AddOrUpdateActivities.tsx

import { ENV } from "@/utils/env.ts";
import { Exercise } from "@/types/exerciseTypes.ts";
import { logout } from "@/services/auth/authService.ts";

interface AddOrUpdateActivitiesResponse {
  success: boolean;
  message: string;
  status: number;
  retry_after?: number;
  data?: Exercise[];
}

interface AddOrUpdateActivitiesProps {
  token: string | null;
  activities: Exercise | Exercise[];
}

export const AddOrUpdateActivities = async ({
  token,
  activities,
}: AddOrUpdateActivitiesProps): Promise<AddOrUpdateActivitiesResponse> => {
  try {
    const isArray = Array.isArray(activities);

    // Helper function to transform an activity
    const transformActivity = (activity: Exercise) => ({
      date: activity.date ? activity.date.toISOString().split("T")[0] : null, // Format date as 'YYYY-MM-DD'
      parent_id: activity.parent_id,
      position: activity.position,
      name: activity.name,
      description: activity.description,
      notes: activity.notes,
      metrics: activity.metrics,
      completed: activity.completed,
      id: activity.id,
    });

    // Construct the data payload as a raw array
    const data = isArray
      ? activities.map(transformActivity)
      : [transformActivity(activities)];

    const url = new URL("/api/activities", ENV.API_URL);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
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
      message:
        responseData.message || "Activities added or updated successfully",
      status: response.status,
      data: responseData.data, // Assuming responseData.data is an array
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
};
