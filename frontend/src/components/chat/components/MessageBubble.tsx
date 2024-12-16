import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface MessageBubbleProps {
    sender: "user" | "assistant";
    message: string;
    tools?: string[];
}

const toolDescriptions: Record<string, string> = {
    updateUserAttributes: "Updated your attributes.",
    deleteUserAttributes: "Deleted attribute(s).",
    getActivities: "Retrieved activity data.",
    updateActivities: "Updated activity data.",
    deleteActivities: "Deleted activity data.",
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message, tools }) => {
    const isUser = sender === "user";
    const [showTools, setShowTools] = useState(false);

    return (
        <div
            className={`max-w-xs md:max-w-xl p-3 rounded-lg ${isUser ? "bg-black text-white self-end" : "bg-gray-200 text-black self-start"
                }`}
        >
            {/* Tools Dropdown */}
            {tools && tools.length > 0 && (
                <div className="mt-2 text-sm italic text-gray-500">
                    <button
                        onClick={() => setShowTools((prev) => !prev)}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
                    >
                        <span className="font-semibold">Actions</span>
                        {showTools ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {showTools && (
                        <ul className="list-none mt-2 ml-2 p-2 rounded-lg">
                            {tools.map((tool, index) => (
                                <li key={index} className="text-gray-500">
                                    {toolDescriptions[tool] || tool}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ ...props }) => <h1 {...props} className="text-3xl font-bold my-4" />,
                    h2: ({ ...props }) => <h2 {...props} className="text-2xl font-bold my-3" />,
                    h3: ({ ...props }) => <h3 {...props} className="text-xl font-semibold my-2" />,
                    p: ({ ...props }) => <p {...props} className="my-2 leading-relaxed" />,
                    a: ({ ...props }) => <a {...props} className="text-primary underline hover:text-blue-600" />,
                    ul: ({ ...props }) => <ul {...props} className="list-disc list-inside my-2" />,
                    ol: ({ ...props }) => <ol {...props} className="list-decimal list-inside my-2" />,
                    li: ({ ...props }) => <li {...props} className="ml-4 my-1" />,
                    blockquote: ({ ...props }) => <blockquote {...props} className="border-l-4 border-gray-400 italic pl-4 my-4 text-gray-600" />,
                    img: ({ ...props }) => <img {...props} className="rounded-md shadow-md mx-auto my-4" />,
                    hr: ({ ...props }) => <hr {...props} className="border-t-2 border-gray-300 my-4" />,
                    table: ({ ...props }) => <table {...props} className="w-full border-collapse border my-4" />,
                    th: ({ ...props }) => <th {...props} className="border border-gray-300 px-3 py-2 text-left bg-gray-100" />,
                    td: ({ ...props }) => <td {...props} className="border border-gray-300 px-3 py-2" />,
                }}
            >
                {message}
            </ReactMarkdown>
        </div>
    );
};

export default MessageBubble;
