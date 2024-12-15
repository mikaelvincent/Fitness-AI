import { ENV } from "@/utils/env";
import Cookies from "js-cookie";

const dummyMessage = `# Welcome to Your AI Chat Interface 🚀

Hello! 👋 I'm here to help you with any questions or tasks you may have. Below are some examples of how you can interact with me:
`;


// Helper function to set default headers
const defaultHeaders = () => {
    const token = Cookies.get("token");
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Generalized fetch API function
const fetchAPI = async (
    endpoint: string,
    method: string,
    body?: object
) => {
    const url = new URL(endpoint, ENV.API_URL); // Base URL + endpoint
    const headers = defaultHeaders();

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

export const postChatMessage = async (
    messages: { role: string; content: string }[],
    tools: string[],
    stream: boolean = false,
    emulate: boolean = true,
) => {
    console.log(messages)
    if (emulate) {
        // Return a mock response for testing
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    message: "Chatbot response generated successfully.",
                    data: {
                        response: dummyMessage,
                        tools: ['updateUserAttributes', 'deleteUserAttributes', 'getActivities', 'updateActivities', 'deleteActivities'],
                    },
                });
            }, 200);
        });
    }

    const payload = {
        messages,
        stream: stream,
        tools: tools,
    };
    return fetchAPI("/api/chat", "POST", payload);
};

