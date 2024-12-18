import { ENV } from "@/shared/utils/env";
import Cookies from "js-cookie";
import { logout } from "@/features/authentication/services/authService";

const dummyMessage = `# Welcome to Your AI Chat Interface 🚀

Hello! 👋 I'm here to help you with any questions or tasks you may have. Below are some examples of how you can interact with me:
`;

interface ChatMessage {
    role: string;
    content: string;
}
interface ChatResponse {
    message: string;
    data: {
        response: string;
        executed_tool_calls: { tool_name: string }[];
    };
}

const defaultHeaders = () => {
    const token = Cookies.get("token");
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

const fetchAPI = async (
    endpoint: string,
    method: string,
    body?: object
): Promise<any> => {
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
        throw new Error(responseData.message || "API request failed.");
    }

    return responseData;
};

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
    emulate: boolean = false,
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

    const payload = {
        messages,
        stream: stream,
        tools: tools,
    };

    const postResponse = await fetchAPI("/api/chat", "POST", payload);
    const message = postResponse.message;
    console.log("Message from the server:", message);
    if (!message || message !== "Your request is being processed.") {
        throw new Error("No message from the server.");
    }

    let currentInterval = 1000;

    while (1) {
        await delay(currentInterval);
        try {
            const getResponse = await fetchAPI(`/api/chat/response`, "GET");
            const chatResponse: ChatResponse = getResponse;
            const message = chatResponse.message;
            console.log("Chat response:", message);
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

export const streamGPTResponse = async (
    messages: { role: string; content: string }[],
    callback: (chunk: string) => void,
    tools: string[] = [],
    model: string = "gpt-4",
) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        ...defaultHeaders(),
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
    };

    const payload = {
        model,
        messages,
        stream: true,
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
            const lines = chunk
                .split("\n")
                .filter((line) => line.trim().startsWith("data:"));

            for (const line of lines) {
                const message = line.replace("data: ", "").trim();
                if (message === "[DONE]") return;
                try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices[0]?.delta?.content || "";
                    callback(content);
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
