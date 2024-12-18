import { ENV } from "@/utils/env";
import Cookies from "js-cookie";
import { logout } from "@/services/auth/authService.ts";

const defaultHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

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
      logout();
    }
    throw new Error(responseData.message || "API request failed.");
  }

  return responseData;
};

export const getUserAttributes = async () => {
  return fetchAPI("/api/user/attributes", "GET");
};

export const updateUserAttributes = async (
  attributes: Record<string, string>,
) => {
  return fetchAPI("/api/user/attributes", "PUT", { attributes });
};

export const deleteUserAttributes = async (keys: string[]) => {
  return fetchAPI("/api/user/attributes", "DELETE", { keys });
};
