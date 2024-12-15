import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { RiAiGenerate } from "react-icons/ri";
import BackButton from "../custom-ui/BackButton";
import { MdOutlineInfo, MdMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getUserAttributes } from "@/services/userAttributesService";
import { postChatMessage } from "@/services/chatService";
import { capitalizeFirstLetter } from "@/utils/utils";

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string, tools?: string[] }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<"chat" | "fitnessProfile">("chat");
    const [profileInfo, setProfileInfo] = useState<{ label: string; value: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const fetchProfileInfo = async () => {
        try {
            const response = await getUserAttributes();
            console.log(response)
            const formattedProfile = capitalizeFirstLetter(response.data);

            setProfileInfo(formattedProfile);
        } catch (error) {
            console.error("Error fetching profile info:", error);
        }
    };

    const sendMessage = async (userMessage: string) => {
        if (isLoading) return;

        // Add the user message to the chat
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // Call the API with the user's message
            const response = await postChatMessage(messages, ['updateUserAttributes', 'deleteUserAttributes'], false, true);

            // Extract the AI response from the API response
            const aiResponse = response?.data?.response || "Sorry, something went wrong.";
            const tools = response?.data?.tools || [];

            // Add the AI response to the chat
            setMessages((prev) => [...prev, { role: "ai", content: aiResponse, tools: tools }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Oops! There was an error. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        if (currentView === "fitnessProfile") fetchProfileInfo();
    }, [currentView]);

    const handleBack = () => window.history.back();
    const handleFitnessProfileClick = () => setCurrentView("fitnessProfile");
    const handleBackToChat = () => setCurrentView("chat");
    const handleGenerateWorkout = () => navigate("/");

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Chat Header */}
            <header className="flex flex-col sticky top-0 z-10 p-6 text-center w-full bg-inherit text-foreground">
                {/* <div>
                    <BackButton onClick={handleBack} />
                </div> */}
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
                        onClick={handleGenerateWorkout}
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

            {/* Conditional Rendering */}
            <main className="flex-1 bg-primary rounded-t-3xl flex flex-col overflow-hidden w-full max-w-full lg:max-w-3xl mx-auto">
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
                        <div className="text-xl text-center animate-pulse mt-4">Genie is thinking...</div>
                    )}
                </div>
                {currentView === "chat" && <ChatInput onSend={sendMessage} isLoading={isLoading} />}
            </main>
        </div>
    );
};

export default ChatInterface;
