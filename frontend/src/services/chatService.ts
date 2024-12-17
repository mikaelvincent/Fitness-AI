import { ENV } from "@/utils/env";
import Cookies from "js-cookie";
import { logout } from "@/services/auth/authService.ts";

const dummyMessage = `# Welcome to Your AI Chat Interface 🚀

Hello! 👋 I'm here to help you with any questions or tasks you may have. Below are some examples of how you can interact with me:
`;

// Define the structure of a chat message
interface ChatMessage {
    role: string;
    content: string;
}

// Define the structure of the response from the backend
interface ChatResponse {
    message: string;
    data: {
        response: string;
        executed_tool_calls: { tool_name: string }[];
    };
}

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
): Promise<any> => {
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

// Utility function to pause execution for a given number of milliseconds
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Sends a chat message and polls the backend for the GPT response.
 * @param messages Array of chat messages.
 * @param tools Array of tools to be used.
 * @param stream Whether to stream the response.
 * @param emulate Whether to use dummy response.
 * @returns The GPT response.
 */
export const postChatMessage = async (
    messages: ChatMessage[],
    tools: string[],
    stream: boolean = false,
    emulate: boolean = false, // Changed default to false for real implementation
): Promise<ChatResponse> => {
    if (emulate) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    message: "Chatbot response generated successfully.",
                    data: {
                        response: dummyMessage,
                        executed_tool_calls: [{ tool_name: "dummyTool" }],
                    },
                });
            }, 200);
        });
    }

    // Step 1: Send the initial POST request
    const payload = {
        messages,
        stream: stream,
        tools: tools,
    };

    const postResponse = await fetchAPI("/api/chat", "POST", payload);
    console.log("POST response:", postResponse);
    // Assume the POST response contains an identifier to fetch the GPT response
    const message = postResponse.message;
    console.log("Message from the server:", message);
    if (!message || message !== "Your request is being processed.") {
        throw new Error("No message from the server.");
    }

    // Step 2: Poll the backend with GET requests until the GPT response is ready
    const maxAttempts = 20; // Maximum number of polling attempts
    let attempts = 0;
    let currentInterval = 1000; // Start with 1 second

    while (attempts < maxAttempts) {
        await delay(currentInterval);
        attempts += 1;
        currentInterval *= 2; // Double the interval each time

        try {
            const getResponse = await fetchAPI(`/api/chat/response`, "GET");
            const chatResponse: ChatResponse = getResponse;
            if (chatResponse.data && chatResponse.data.response) {
                return chatResponse;
            }
        } catch (error) {
            console.error("Error while polling for GPT response:", error);
            throw error;
        }
    }

    throw new Error("GPT response not received within the expected time.");
};

// Function to call OpenAI GPT API with streaming support
export const streamGPTResponse = async (
    messages: { role: string; content: string }[],
    callback: (chunk: string) => void,
    tools: string[] = [],
    model: string = "gpt-4",
) => {
    const url = "https://api.openai.com/v1/chat/completions"; // OpenAI endpoint
    const headers = {
        ...defaultHeaders(),
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
    };

    const payload = {
        model,
        messages,
        stream: true, // Enable streaming
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.body) throw new Error("No readable stream available.");
        if (!response.ok) {
            if (response.status === 401) {
                // Trigger logout if unauthorized
                logout();
            }
            throw new Error("API request failed.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            const chunk = decoder.decode(value, { stream: true });
            // Extract data chunks and handle callback
            const lines = chunk
                .split("\n")
                .filter((line) => line.trim().startsWith("data:"));

            for (const line of lines) {
                const message = line.replace("data: ", "").trim();
                if (message === "[DONE]") return; // Stream ends
                try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices[0]?.delta?.content || "";
                    callback(content); // Pass content chunk to callback
                } catch (err) {
                    console.error("Error parsing stream chunk:", err);
                }
            }
        }
    } catch (error) {
        console.error("Error in streaming GPT response:", error);
        throw error;
    }
};
