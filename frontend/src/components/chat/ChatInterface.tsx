import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { useTheme } from "@/components/theme/theme-provider";
import { MdArrowBack } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";

const ChatInterface: React.FC = () => {
    const { appliedTheme } = useTheme();
    const [messages, setMessages] = useState<{ sender: "user" | "ai"; message: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = (userMessage: string) => {
        if (isLoading) return;

        setMessages((prev) => [...prev, { sender: "user", message: userMessage }]);
        setIsLoading(true);

        // Mock AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", message: "This is a mock response. How can I help you?" },
            ]);
            setIsLoading(false);
        }, 100);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleBack = () => {
        console.log("Back button clicked");
        window.history.back();
    };

    return (
        <div
            className={`min-h-screen flex flex-col bg-background text-foreground`}
        >
            {/* Chat Header */}
            <header className={`flex flex-col sticky top-0 z-10 p-6 text-center w-full bg-inherit text-foreground `}>
                <div>
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-500 hover:text-gray-100"
                    >
                        <MdArrowBack size={24} />
                        <span className="ml-1 text-sm font-medium">Back</span>
                    </button>
                </div>
                <div className="pt-8">
                    <h1 className="text-2xl lg:text-3xl font-bold">What Is Your Goal?</h1>
                    <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                        Discuss your fitness goals with our AI coach to create a personalized workout plan. Share your
                        preferences, then click <strong>'Generate Workout'</strong> to get a custom plan tailored just for you!
                    </p>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => console.log("Generate workout clicked")}
                        className="flex items-center text-primary hover:text-gray-100"
                    >
                        <RiAiGenerate size={24} />
                        <span className="ml-1 text-sm font-medium">Generate Workout</span>
                    </button>
                </div>

            </header>

            <main className="flex-1 bg-primary rounded-t-3xl flex flex-col overflow-hidden w-full max-w-full lg:max-w-3xl mx-auto">
                <div className="flex-1 flex flex-col justify-end p-4 relative">
                    <div className="absolute inset-0 top-0 bottom-0 overflow-y-auto p-4">
                        <div className="flex flex-col gap-2">
                            {messages.map((msg, index) => (
                                <MessageBubble key={index} message={msg.message} sender={msg.sender} />
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {isLoading && (
                            <div className="text-lg text-center animate-pulse mt-4">
                                Genie is thinking...
                            </div>
                        )}
                    </div>
                </div>
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default ChatInterface;
