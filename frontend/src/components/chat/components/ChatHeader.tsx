import React from "react";
import { RiAiGenerate } from "react-icons/ri";
import { MdOutlineInfo, MdMessage } from "react-icons/md";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/custom-ui/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <header className="flex flex-col sticky top-0 z-10 p-6 text-center w-full bg-inherit text-foreground">
            <div className="">
                {location.pathname === "/chat" && (
                    <div>
                        <BackButton onClick={() => navigate('/dashboard')} />
                    </div>
                )}
                {isChatView ? (
                    <>
                        <h1 className="text-2xl lg:text-3xl font-bold">What Is Your Goal?</h1>
                        <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                            Discuss your fitness goals with <span className="font-semibold text-primary">GymGenie</span> to create a personalized workout plan.
                            Share your preferences, then ask genie to generate your workoutplan!
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl lg:text-3xl font-bold">Your Fitness Profile</h1>
                        <p className="mt-2 text-sm lg:text-base max-w-2xl mx-auto">
                            Based on your goals and preferences, our <span className="font-semibold text-primary">GymGenie</span> will build a tailored workout plan. Once ready,
                            ask genie to generate your workoutplan!
                        </p>
                    </>
                )}
            </div>

            <div className="flex flex-row-reverse justify-center mt-4 items-center gap-2">
                {
                    isChatView ? (
                        <Button
                            onClick={onFitnessProfileClick}
                            className="border-2 border-gray-600"
                            variant="outline"
                        >
                            <MdOutlineInfo size={24} />
                            <span className="ml-1 text-sm font-medium hover:underline-offset-1">Fitness Profile</span>
                        </Button>
                    ) : (
                        <Button
                            onClick={onBackToChatClick}
                            className="border-2 border-gray-600"
                            variant="outline"
                        >
                            <MdMessage size={24} />
                            <span className="ml-1 text-sm font-medium">Back to Chat</span>
                        </Button>
                    )
                }
            </div >
        </header >
    );
};

export default ChatHeader;
