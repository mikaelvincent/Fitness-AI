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
    console.log(response)
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
    if (emulate) {
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
    console.log(payload)
    return fetchAPI("/api/chat", "POST", payload);
};

// Function to call OpenAI GPT API with streaming support
export const streamGPTResponse = async (
    messages: { role: string; content: string }[],
    callback: (chunk: string) => void,
    tools: string[] = [],
    model: string = "gpt-4"
) => {
    const url = "https://api.openai.com/v1/chat/completions"; // OpenAI endpoint
    const headers = {
        ...defaultHeaders(),
        Authorization: `Bearer {ENV.OPENAI_API_KEY}`,
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

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            const chunk = decoder.decode(value, { stream: true });
            // Extract data chunks and handle callback
            const lines = chunk.split("\n").filter((line) => line.trim().startsWith("data:"));

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
    }
};
