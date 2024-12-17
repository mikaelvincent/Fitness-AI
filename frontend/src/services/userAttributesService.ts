import { ENV } from "@/utils/env";
import Cookies from "js-cookie";
import { logout } from "@/services/auth/authService.ts"; // Assumes you're using js-cookie

// Common headers for all requests
const defaultHeaders = () => {
  const token = Cookies.get("token"); // Automatically retrieve token
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function for fetch calls
const fetchAPI = async (endpoint: string, method: string, body?: object) => {
  const url = new URL(endpoint, ENV.API_URL);
  const headers = defaultHeaders();

  const options: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(url.toString(), options);
  const responseData = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Trigger logout if unauthorized
      logout();
    }
    throw new Error(responseData.message || "API request failed.");
  }

  return responseData;
};

// Fetch all user attributes
export const getUserAttributes = async () => {
  return fetchAPI("/api/user/attributes", "GET");
};

// Update user attributes
export const updateUserAttributes = async (
  attributes: Record<string, string>,
) => {
  return fetchAPI("/api/user/attributes", "PUT", { attributes });
};

// Delete specified user attributes
export const deleteUserAttributes = async (keys: string[]) => {
  return fetchAPI("/api/user/attributes", "DELETE", { keys });
};
