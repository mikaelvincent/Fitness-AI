// src/pages/chat/ChatInterface.tsx

import React, { useEffect, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatFooter from "./components/ChatFooter";
import { useChat } from "../../hooks/useChat";
import { useNavigate } from "react-router-dom";
import ChatTutorial from "./components/ChatTutorial"; // Import the tutorial component

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

  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("chatTutorialSeen");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem("chatTutorialSeen", "true");
    }
  }, []);

  const handleGenerateWorkout = () => navigate("/dashboard");

  return (
    <div className="chat mx-2 flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      {showTutorial && <ChatTutorial />}
      <ChatHeader
        currentView={currentView}
        onGenerateWorkout={handleGenerateWorkout}
        onFitnessProfileClick={switchToFitnessProfile}
        onBackToChatClick={switchToChat}
      />
      <main className="flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-t-3xl bg-primary lg:max-w-3xl">
        <ChatMessages
          currentView={currentView}
          messages={messages}
          profileInfo={profileInfo}
          chatEndRef={chatEndRef}
          isLoading={isLoading}
        />
        <ChatFooter
          onSend={sendMessage}
          isLoading={isLoading}
          showInput={currentView === "chat"}
        />
      </main>
    </div>
  );
};

export default ChatInterface;
