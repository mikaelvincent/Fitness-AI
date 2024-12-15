import { useState, useEffect, useRef } from "react";
import { postChatMessage } from "@/services/chatService";
import { getUserAttributes } from "@/services/userAttributesService";
import { capitalizeFirstLetter } from "@/utils/utils";

type Message = {
    role: "user" | "ai";
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
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await postChatMessage(messages, ["updateUserAttributes", "deleteUserAttributes"], false, true);
            const aiResponse = response?.data?.response || "Sorry, something went wrong.";
            const tools = response?.data?.tools || [];
            setMessages((prev) => [...prev, { role: "ai", content: aiResponse, tools }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { role: "ai", content: "Oops! There was an error. Please try again later." }]);
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
