import { useEffect, useRef, useState } from "react";
import { postChatMessage } from "@/services/chatService";
import { getUserAttributes } from "@/services/userAttributesService";
import { capitalizeFirstLetter } from "@/utils/utils";
import { useLocation } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
  tools?: string[];
};
interface PostChatMessageResponse {
  message: string;
  data: {
    response: string;
    executed_tool_calls: { tool_name: string }[];
  };
}

type ProfileInfo = { label: string; value: string }[];

interface UseChatProps {
  initialMessages?: Message[];
}

export const useChat = ({ initialMessages = [] }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<"chat" | "fitnessProfile">(
    "chat",
  );
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const toolsForInitialChat = ["updateUserAttributes", "deleteUserAttributes"];
  const toolsForMainChat = [
    "updateUserAttributes",
    "deleteUserAttributes",
    "getActivities",
    "updateActivities",
    "deleteActivities",
  ];

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

    // Determine the tools based on route
    const tools =
      location.pathname === "/initial-chat"
        ? toolsForInitialChat
        : toolsForMainChat;

    // Prepare messages for API (remove tools)
    const sanitizedMessages = updatedMessages.map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      const response = await postChatMessage(
        sanitizedMessages,
        tools,
        false,
      );
      const aiResponse =
        response?.data?.response || "Sorry, something went wrong.";
      const tool_calls = response?.data?.executed_tool_calls || [];
      const toolNames = tool_calls.map(
        (tool: { tool_name: string }) => tool.tool_name,
      );

      // Attach tools internally
      const newAIMessage: Message = {
        role: "assistant",
        content: aiResponse,
        tools: toolNames, // Tools stay internal
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

  // const sendMessage = async (userMessage: string) => {
  //     if (isLoading) return;

  //     const newUserMessage: Message = { role: "user", content: userMessage };
  //     setMessages((prev) => [...prev, newUserMessage]); // Add user message

  //     setIsLoading(true);

  //     try {
  //         // Add an empty assistant message to start streaming
  //         setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  //         const handleStream = (chunk: string) => {
  //             setMessages((prevMessages) => {
  //                 const lastMessage = prevMessages[prevMessages.length - 1];
  //                 if (lastMessage?.role === "assistant") {
  //                     return [
  //                         ...prevMessages.slice(0, -1),
  //                         { ...lastMessage, content: lastMessage.content + chunk },
  //                     ];
  //                 }
  //                 return [...prevMessages, { role: "assistant", content: chunk }];
  //             });
  //         };

  //         await streamGPTResponse(
  //             [...messages, newUserMessage],
  //             handleStream,
  //             ["updateUserAttributes", "deleteUserAttributes"],
  //             "gpt-4"
  //         );

  //     } catch (error) {
  //         console.error("Error streaming GPT response:", error);
  //         setMessages((prevMessages) => {
  //             const lastMessage = prevMessages[prevMessages.length - 1];
  //             if (lastMessage?.role === "assistant") {
  //                 return [
  //                     ...prevMessages.slice(0, -1),
  //                     { ...lastMessage, content: "Oops! There was an error. Please try again later." },
  //                 ];
  //             }
  //             return prevMessages;
  //         });
  //     } finally {
  //         setIsLoading(false);
  //     }
  // };

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
