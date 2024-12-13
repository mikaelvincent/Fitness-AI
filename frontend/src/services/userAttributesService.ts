import { ENV } from "@/utils/env";

// Common headers for all requests
const defaultHeaders = (token?: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
});

// Helper function for fetch calls
const fetchAPI = async (
    endpoint: string,
    method: string,
    token?: string,
    body?: object
) => {
    const url = new URL(endpoint, ENV.API_URL);
    const headers = defaultHeaders(token);

    const options: RequestInit = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(url.toString(), options);
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || "API request failed.");
    }

    return responseData;
};

// Fetch all user attributes
export const getUserAttributes = async (token: string) => {
    return fetchAPI("/api/user/attributes", "GET", token);
};

// Update user attributes
export const updateUserAttributes = async (
    attributes: Record<string, string>,
    token: string
) => {
    return fetchAPI("/api/user/attributes", "PUT", token, { attributes });
};

// Delete specified user attributes
export const deleteUserAttributes = async (keys: string[], token: string) => {
    return fetchAPI("/api/user/attributes", "DELETE", token, { keys });
};
