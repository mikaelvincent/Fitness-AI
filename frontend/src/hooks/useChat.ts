import { useState, useEffect, useRef } from "react";
import { postChatMessage } from "@/services/chatService";
import { getUserAttributes } from "@/services/userAttributesService";
import { capitalizeFirstLetter } from "@/utils/utils";
import { streamGPTResponse } from "@/services/chatService";

type Message = {
    role: "user" | "assistant";
    content: string;
    tools?: string[];
};

type ProfileInfo = { label: string; value: string }[];

interface UseChatProps {
    initialMessages?: Message[];
}

export const useChat = ({ initialMessages = [] }: UseChatProps) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<"chat" | "fitnessProfile">("chat");
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (currentView === "fitnessProfile") fetchProfileInfo();
    }, [currentView]);

    useEffect(() => {
        if (currentView === "chat") {
            scrollToBottom();
        }
    }, [currentView]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchProfileInfo = async () => {
        try {
            const response = await getUserAttributes();
            const formattedProfile = capitalizeFirstLetter(response.data);
            setProfileInfo(formattedProfile);
        } catch (error) {
            console.error("Error fetching profile info:", error);
        }
    };

    const sendMessage = async (userMessage: string) => {
        if (isLoading) return;

        const newUserMessage: Message = { role: "user", content: userMessage };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        // Prepare messages for API (remove tools)
        const sanitizedMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

        try {
            const response = await postChatMessage(
                sanitizedMessages,
                ["updateUserAttributes", "deleteUserAttributes"],
                false,
                false
            );

            const aiResponse = response?.data?.response || "Sorry, something went wrong.";
            const tools = response?.data?.tools || [];

            // Attach tools internally
            const newAIMessage: Message = {
                role: "assistant",
                content: aiResponse,
                tools: tools, // Tools stay internal
            };

            setMessages((prev) => [...prev, newAIMessage]);
        } catch (error) {
            console.error("Error sending message:", error);

            const errorMessage: Message = {
                role: "assistant",
                content: "Oops! There was an error. Please try again later.",
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const switchToFitnessProfile = () => setCurrentView("fitnessProfile");
    const switchToChat = () => setCurrentView("chat");

    return {
        messages,
        isLoading,
        currentView,
        profileInfo,
        chatEndRef,
        sendMessage,
        switchToFitnessProfile,
        switchToChat,
    };
};
