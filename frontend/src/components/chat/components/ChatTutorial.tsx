import React from "react";
import Joyride, { Step } from "react-joyride";

const ChatTutorial: React.FC = () => {
    const steps: Step[] = [
        {
            target: ".chat",
            content: "Welcome to GymGenie Chat Interface! Here you can chat with GymGenie to create a personalized workout plan. You can also update your attributes found in the fitness profile. You can also generate your workout plan.",
            placement: "bottom",
        },
        {
            target: ".chat-fitness-profile-button",
            content: "Here you can switch between Fitness Profile to show all your attributes we collected from the setup and chatting with GymGenie.",
            placement: "bottom",
        },
        {
            target: ".chat-input",
            content: "Use this section to type and send your messages to GymGenie.",
            placement: "top",
        },
    ];

    return (
        <Joyride
            steps={steps}
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
            styles={{
                options: {
                    zIndex: 10000,
                },
            }}
        />
    );
};

export default ChatTutorial;
