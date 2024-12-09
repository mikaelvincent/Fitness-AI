import React from "react";

type MessageBubbleProps = {
    message: string;
    sender: "user" | "ai";
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender }) => {
    const isUser = sender === "user";

    return (
        <div
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
        >
            <div
                className={`max-w-[70%] p-4 rounded-lg shadow-md ${isUser
                    ? "bg-background rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
            >
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};

export default MessageBubble;
