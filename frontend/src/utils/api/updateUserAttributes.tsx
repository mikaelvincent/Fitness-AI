import { ENV } from "@/utils/env";
import { z } from "zod";

// Define the schema for key-value pairs
export const AttributesSchema = z.record(z.string().max(255)); // Ensures key-value pairs

interface UpdateAttributesResponse {
    success: boolean;
    message: string;
    status?: number;
}

// Function to update user attributes
export const updateUserAttributes = async (
    data: z.infer<typeof AttributesSchema>,
    token: string
): Promise<UpdateAttributesResponse> => {
    try {
        const url = new URL("/api/user/attributes", ENV.API_URL);

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url.toString(), {
            method: "PUT",
            headers,
            body: JSON.stringify({ attributes: data }),
        });

        const responseData = await response.json();

        console.log("Response data:", responseData);

        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Failed to update user attributes.",
                status: response.status,
            };
        }

        return {
            success: true,
            message: responseData.message || "User attributes updated successfully!",
        };
    } catch (error) {
        console.error("Update attributes error:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
            status: 500,
        };
    }
};
