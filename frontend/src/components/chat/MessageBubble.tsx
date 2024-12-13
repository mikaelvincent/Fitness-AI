import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
    sender: "user" | "ai";
    message: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message }) => {
    const isUser = sender === "user";

    return (
        <div
            className={`max-w-xs md:max-w-xl p-3 rounded-lg ${isUser
                ? "bg-black text-white self-end"
                : "bg-gray-200 text-black self-start"
                }`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]} // Optional for GitHub-flavored markdown
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 {...props} className="text-3xl font-bold my-4" />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 {...props} className="text-2xl font-bold my-3" />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 {...props} className="text-xl font-semibold my-2" />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 {...props} className="text-lg font-semibold my-2" />
                    ),
                    h5: ({ node, ...props }) => (
                        <h5 {...props} className="text-lg font-semibold my-2" />
                    ),
                    h6: ({ node, ...props }) => (
                        <h6 {...props} className="text-lg font-semibold my-2" />
                    ),
                    p: ({ node, ...props }) => (
                        <p {...props} className="my-2 leading-relaxed" />
                    ),
                    a: ({ node, ...props }) => (
                        <a {...props} className="text-primary underline hover:text-blue-600" />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul {...props} className="list-disc list-inside my-2" />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol {...props} className="list-decimal list-inside my-2" />
                    ),
                    li: ({ node, ...props }) => (
                        <li {...props} className="ml-4 my-1" />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            {...props}
                            className="border-l-4 border-gray-400 italic pl-4 my-4 text-gray-600"
                        />
                    ),
                    img: ({ node, ...props }) => (
                        <img {...props} className="rounded-md shadow-md mx-auto my-4" />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr {...props} className="border-t-2 border-gray-300 my-4" />
                    ),
                    table: ({ node, ...props }) => (
                        <table {...props} className="w-full border-collapse border my-4">
                            {props.children}
                        </table>
                    ),
                    th: ({ node, ...props }) => (
                        <th
                            {...props}
                            className="border border-gray-300 px-3 py-2 text-left bg-gray-100"
                        />
                    ),
                    td: ({ node, ...props }) => (
                        <td {...props} className="border border-gray-300 px-3 py-2" />
                    ),
                }}
            >
                {message}
            </ReactMarkdown>
        </div >
    );
};

export default MessageBubble;
