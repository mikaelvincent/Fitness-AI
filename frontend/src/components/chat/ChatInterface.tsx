import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { useTheme } from "@/components/theme/theme-provider";
import { RiAiGenerate } from "react-icons/ri";
import BackButton from "../custom-ui/BackButton";
import { MdOutlineInfo, MdMessage } from "react-icons/md";

const ChatInterface: React.FC = () => {
    const { appliedTheme } = useTheme();
    const [messages, setMessages] = useState<{ sender: "user" | "ai"; message: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<"chat" | "fitnessProfile">("chat");
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const profileInfo = [
        { label: "Age", value: "28" },
        { label: "Weight", value: "75 kg" },
        { label: "Height", value: "5'9\"" },
        { label: "Fitness Goal", value: "Build muscle and increase endurance." },
        { label: "Preferred Workout", value: "Strength Training, HIIT, and Core Workouts" },
        { label: "Weekly Sessions", value: "4-5, depending on availability" },
    ];

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
        }, 2000);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleBack = () => window.history.back();
    const handleFitnessProfileClick = () => setCurrentView("fitnessProfile");
    const handleBackToChat = () => setCurrentView("chat");

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Chat Header */}
            <header className="flex flex-col sticky top-0 z-10 p-6 text-center w-full bg-inherit text-foreground">
                <div>
                    <BackButton onClick={handleBack} />
                </div>
                {currentView === "chat" ? (
                    <div className="pt-8">
                        <h1 className="text-2xl lg:text-3xl font-bold">What Is Your Goal?</h1>
                        <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                            Discuss your fitness goals with our AI coach to create a personalized workout plan. Share your
                            preferences, then click <strong>'Generate Workout'</strong> to get a custom plan tailored just for you!
                        </p>
                    </div>
                ) : (
                    <div className="pt-8">
                        <h1 className="text-2xl lg:text-3xl font-bold">Your Fitness Profile</h1>
                        <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                            Based on the goals and preferences you share,
                            our AI coach will build a workout plan tailored just for you. Once you're ready, click
                            <strong>'Generate Workout'</strong> to kickstart your personalized plan!
                        </p>
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => console.log("Generate workout clicked")}
                        className="flex items-center text-primary hover:text-white transition-colors rounded-lg px-3 py-2"
                    >
                        <RiAiGenerate size={24} />
                        <span className="ml-1 text-sm font-medium">Generate Workout</span>
                    </button>
                    {currentView === "chat" ? (
                        <button
                            onClick={handleFitnessProfileClick}
                            className="flex items-center text-primary hover:text-white transition-colors rounded-lg px-3 py-2"
                        >
                            <MdOutlineInfo size={24} />
                            Fitness Profile
                        </button>
                    ) : (
                        <button
                            onClick={handleBackToChat}
                            className="flex items-center text-primary hover:text-white transition-colors rounded-lg px-3 py-2"
                        >
                            <MdMessage size={24} />
                            Back to Chat
                        </button>
                    )}
                </div>
            </header>

            {/* Main content area */}
            <main className="flex-1 bg-primary rounded-t-3xl flex flex-col overflow-hidden w-full max-w-full lg:max-w-3xl mx-auto relative">
                <div className="flex-1 flex flex-col p-4 relative">

                    {/* Chat View */}
                    <div
                        className={`
        absolute inset-0 overflow-y-auto
        transition-all duration-500
        ${currentView === "chat" ? "opacity-100 translate-y-0 z-10" : "opacity-0 -translate-y-full z-0"}
    `}
                    >
                        <div className="flex flex-col gap-2">
                            {messages.map((msg, index) => (
                                <MessageBubble key={index} message={msg.message} sender={msg.sender} />
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        {isLoading && (
                            <div className="text-xl text-center animate-pulse mt-4">Genie is thinking...</div>
                        )}
                    </div>

                    {/* Fitness Profile View */}
                    <div
                        className={`
                            absolute inset-0 overflow-y-auto
                            transition-all duration-500
                            ${currentView === "fitnessProfile" ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-full z-0"}
                        `}
                    >
                        <div className="p-4 text-white rounded-lg">
                            <ul className="space-y-2 w-full">
                                {profileInfo.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center p-3 rounded-lg bg-background hover:bg-gray-700 transition duration-300"
                                    >
                                        <span className="text-md">{`${item.label}: ${item.value}`}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>


                {currentView === "chat" && <ChatInput onSend={sendMessage} isLoading={isLoading} />}
            </main>
        </div>
    );
};

export default ChatInterface;
