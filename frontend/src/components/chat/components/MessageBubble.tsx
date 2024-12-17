import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import rehypeRaw from "rehype-raw";

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
                    h1: ({ ...props }) => <h1 {...props} className="text-4xl font-bold my-4 break-words" />,
                    h2: ({ ...props }) => <h2 {...props} className="text-3xl font-semibold my-3 break-words" />,
                    h3: ({ ...props }) => <h3 {...props} className="text-2xl font-medium my-2 break-words" />,
                    p: ({ ...props }) => <p {...props} className="my-2 leading-relaxed break-words" />,
                    ul: ({ ...props }) => <ul {...props} className="list-disc list-inside pl-4 my-2 break-words" />,
                    ol: ({ ...props }) => <ol {...props} className="list-decimal list-inside pl-4 my-2 break-words" />,
                    li: ({ ...props }) => <li {...props} className="leading-relaxed break-words" />,
                    blockquote: ({ ...props }) => (
                        <blockquote {...props} className="border-l-4 border-blue-400 pl-4 italic my-4 text-gray-600 break-words" />
                    ),
                    code: ({ ...props }) => (
                        <code {...props} className="bg-gray-100 text-red-600 rounded px-2 py-1 text-sm break-words" />
                    ),
                    pre: ({ ...props }) => (
                        <pre {...props} className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4 break-words" />
                    ),
                    img: ({ ...props }) => (
                        <img {...props} className="rounded-md shadow-md mx-auto my-4 max-w-full h-auto" />
                    ),
                    hr: ({ ...props }) => <hr {...props} className="border-t-2 border-gray-300 my-6" />,
                    table: ({ ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table {...props} className="w-full border-collapse border break-words" />
                        </div>
                    ),
                    th: ({ ...props }) => (
                        <th {...props} className="border border-gray-300 px-3 py-2 bg-gray-100 text-left break-words" />
                    ),
                    td: ({ ...props }) => <td {...props} className="border border-gray-300 px-3 py-2 break-words" />,
                    a: ({ ...props }) => (
                        <a
                            {...props}
                            className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 break-words"
                        />
                    ),
                }}
            >
                {message}
            </ReactMarkdown>


        </div>
    );
};

export default MessageBubble;
