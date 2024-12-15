import React from "react";
import { RiAiGenerate } from "react-icons/ri";
import { MdOutlineInfo, MdMessage } from "react-icons/md";

interface ChatHeaderProps {
    currentView: "chat" | "fitnessProfile";
    onGenerateWorkout: () => void;
    onFitnessProfileClick: () => void;
    onBackToChatClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    currentView,
    onGenerateWorkout,
    onFitnessProfileClick,
    onBackToChatClick,
}) => {
    const isChatView = currentView === "chat";

    return (
        <header className="flex flex-col sticky top-0 z-10 p-6 text-center w-full bg-inherit text-foreground">
            <div className="pt-8">
                {isChatView ? (
                    <>
                        <h1 className="text-2xl lg:text-3xl font-bold">What Is Your Goal?</h1>
                        <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                            Discuss your fitness goals with our AI coach to create a personalized workout plan.
                            Share your preferences, then click <strong>'Generate Workout'</strong> to get a custom plan!
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl lg:text-3xl font-bold">Your Fitness Profile</h1>
                        <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                            Based on your goals and preferences, our AI coach will build a tailored workout plan. Once ready,
                            click <strong>'Generate Workout'</strong> to kickstart your journey!
                        </p>
                    </>
                )}
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={onGenerateWorkout}
                    className="flex items-center text-primary hover:text-white transition-colors rounded-lg px-3 py-2"
                >
                    <RiAiGenerate size={24} />
                    <span className="ml-1 text-sm font-medium">Generate Workout</span>
                </button>

                {isChatView ? (
                    <button
                        onClick={onFitnessProfileClick}
                        className="flex items-center text-primary hover:text-white transition-colors rounded-lg px-3 py-2"
                    >
                        <MdOutlineInfo size={24} />
                        Fitness Profile
                    </button>
                ) : (
                    <button
                        onClick={onBackToChatClick}
                        className="flex items-center text-primary hover:text-white transition-colors rounded-lg px-3 py-2"
                    >
                        <MdMessage size={24} />
                        Back to Chat
                    </button>
                )}
            </div>
        </header>
    );
};

export default ChatHeader;
