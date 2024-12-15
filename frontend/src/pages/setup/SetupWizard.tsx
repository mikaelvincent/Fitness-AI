// src/pages/setup/SetupWizard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useSetupData } from "../../components/setup/SetupContext.tsx";
import { updateUserAttributes } from "@/services/userAttributesService";
import { steps } from "./stepsConfig";
import StepContent from "../../components/setup/StepContent.tsx";
import { StepCard } from "../../components/setup/StepCard.tsx";
import { isAtLeast13AtMost100 } from "./utils";

export const SetupWizard: React.FC = () => {
    const { data, updateData } = useSetupData();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const currentStep = steps[currentStepIndex];

    const handleNext = () => setCurrentStepIndex(i => i + 1);
    const handlePrev = () => setCurrentStepIndex(i => i - 1);

    const handleFinish = async () => {
        setIsSubmitting(true);

        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const birthdate = `${data.birthdateYear}-${data.birthdateMonth}-${data.birthdateDay}`;
            const weightString = `${data.weight} ${data.measurement === "metric" ? "kg" : "lbs"}`;
            const heightString = `${data.height} ${data.measurement === "metric" ? "cm" : "inches"}`;

            const payload = {
                gender: data.gender,
                birthdate,
                measurement: data.measurement,
                weight: weightString,
                height: heightString,
                activity: data.activity,
                nickname: data.nickname,
            };

            await updateUserAttributes(payload);
            navigate("/initial-chat");
        } catch (error: any) {
            console.error("Error:", error.message);
            const errorMsg = error.message === "Authentication token not found."
                ? "You are not authenticated. Please log in."
                : error.message || "Failed to update user attributes.";
            toast({ title: "Error", description: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const canGoNext = (): boolean => {
        switch (currentStep.id) {
            case "gender":
                return !!data.gender.trim();
            case "birthdate":
                return isAtLeast13AtMost100(data.birthdateDay, data.birthdateMonth, data.birthdateYear);
            case "measurement":
                return ["metric", "imperial"].includes(data.measurement);
            case "weight":
                return data.weight > 0;
            case "height":
                return data.height > 0;
            case "activity":
                return !!data.activity.trim();
            case "nickname":
                return !!data.nickname.trim();
            default:
                return true;
        }
    };

    const handleChange = (key: string, value: any) => updateData({ [key]: value });

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    return (
        <div className="w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <StepCard
                        title={currentStep.title}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onFinish={handleFinish}
                        canGoNext={canGoNext()}
                        isFirstStep={isFirstStep}
                        isLastStep={isLastStep}
                        isSubmitting={isSubmitting}
                    >
                        <StepContent stepId={currentStep.id} data={data} onChange={handleChange} />
                    </StepCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SetupWizard;
