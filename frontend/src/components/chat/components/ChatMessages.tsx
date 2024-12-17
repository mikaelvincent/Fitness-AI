import React from "react";
import MessageBubble from "./MessageBubble";

interface ChatMessagesProps {
    currentView: "chat" | "fitnessProfile";
    messages: {
        role: "user" | "assistant";
        content: string;
        tools?: string[];
    }[];
    profileInfo: { label: string; value: string }[];
    chatEndRef: React.RefObject<HTMLDivElement>;
    isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    currentView,
    messages,
    profileInfo,
    chatEndRef,
    isLoading,
}) => {
    return (
        <div className="flex-1 flex flex-col justify-end p-4 relative">
            <div className="absolute inset-0 top-0 bottom-0 overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                    {currentView === "chat" ? (
                        messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg.content} sender={msg.role} tools={msg.tools} />
                        ))
                    ) : (
                        <div className="p-4 text-white rounded-lg">
                            <ul className="space-y-2 w-full">
                                {profileInfo.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center p-3 rounded-lg bg-background hover:bg-gray-700 transition duration-300"
                                    >
                                        <span className="text-md font-medium">{item.label}:</span>
                                        <span className="text-md">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>
            {isLoading && (
                <div className="text-xl font-semibold text-center animate-pulse mt-4 text-gray-900">Genie is thinking...</div>
            )}
        </div>
    );
};

export default ChatMessages;