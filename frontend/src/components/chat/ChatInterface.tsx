import React from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatFooter from "./components/ChatFooter";
import { useChat } from "../../hooks/useChat";
import { useNavigate } from "react-router-dom";

const INITIAL_AI_MESSAGE = [
    {
        role: "assistant" as const,
        content: `**Hi I'm GymGenie Your AI Workout Coach!** 🏋️‍♂️  
I’m here to help you create a personalized workout plan based on your fitness goals, preferences, and current lifestyle. 

Let's get started! Could you tell me:  
**What’s your primary fitness goal?**  
   - *e.g., Lose weight, build muscle, improve endurance, or stay active.*  
   
**How many days per week can you work out?**  
   - *e.g., Weekends, weekdays, or specific days.*

**Do you have any specific preferences or limitations?**  
   - *e.g., Home workouts, gym workouts, equipment available, or injuries.*

Feel free to **add more information**. The more you share, the better I can tailor your workout plan. 😊`,
    },
];

const ChatInterface: React.FC = () => {
    const navigate = useNavigate();
    const {
        messages,
        isLoading,
        currentView,
        profileInfo,
        chatEndRef,
        sendMessage,
        switchToFitnessProfile,
        switchToChat,
    } = useChat({ initialMessages: INITIAL_AI_MESSAGE });

    const handleGenerateWorkout = () => navigate("/");

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground justify-center items-center mx-2">
            <ChatHeader
                currentView={currentView}
                onGenerateWorkout={handleGenerateWorkout}
                onFitnessProfileClick={switchToFitnessProfile}
                onBackToChatClick={switchToChat}
            />
            <main className="flex-1 bg-primary rounded-t-3xl flex flex-col overflow-hidden w-full max-w-full lg:max-w-3xl">
                <ChatMessages
                    currentView={currentView}
                    messages={messages}
                    profileInfo={profileInfo}
                    chatEndRef={chatEndRef}
                    isLoading={isLoading}
                />
                <ChatFooter onSend={sendMessage} isLoading={isLoading} showInput={currentView === "chat"} />
            </main>
        </div>
    );
};

export default ChatInterface;
