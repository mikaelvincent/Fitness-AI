import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useSetupData } from "@/components/setup/SetupContext";
import { updateUserAttributes } from "@/services/userAttributesService";
import { steps } from "./stepsConfig";
import StepContent from "@/components/setup/StepContent";
import { StepCard } from "@/components/setup/StepCard";
import { isAtLeast13AtMost100 } from "@/utils/setupUtils";

export const SetupWizard: React.FC = () => {
    const { data, updateData } = useSetupData();
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedStep = localStorage.getItem("currentStepIndex");
        const savedData = localStorage.getItem("setupData");

        if (savedStep) {
            setCurrentStepIndex(Number(savedStep));
        }
        if (savedData) {
            updateData(JSON.parse(savedData));
        }
    }, [updateData]);

    const currentStep = steps[currentStepIndex];

    const saveProgress = (index: number, newData: any) => {
        localStorage.setItem("currentStepIndex", index.toString());
        localStorage.setItem("setupData", JSON.stringify(newData));
    };

    const handleNext = () => {
        const nextStep = currentStepIndex + 1;
        setCurrentStepIndex(nextStep);
        saveProgress(nextStep, data);
    };

    const handlePrev = () => {
        const prevStep = currentStepIndex - 1;
        setCurrentStepIndex(prevStep);
        saveProgress(prevStep, data);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const birthdate = `${data.birthdate}`;
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

            localStorage.removeItem("currentStepIndex");
            localStorage.removeItem("setupData");

            navigate("/verify-email");
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

    const handleFinish = () => {

        const isAllDataFilled = validateAllData();

        if (!isAllDataFilled) {
            toast({
                title: "Incomplete Data",
                description: "Please ensure all fields are filled out correctly before finishing.",
            });
            return;
        }

        handleSubmit();
    };

    const validateAllData = () => {
        const requiredFields = [
            "gender",
            "birthdate",
            "measurement",
            "weight",
            "height",
            "activity",
            "nickname",
        ];

        for (const field of requiredFields) {
            if (!data[field] || (typeof data[field] === "string" && !data[field].trim())) {
                return false;
            }
        }

        if (!isAtLeast13AtMost100(data.birthdate)) {
            toast({ title: "Invalid Birthdate", description: "Please enter a valid birthdate." });
            return false;
        }

        if (data.nickname.length < 3 || data.nickname.length > 30) {
            toast({
                title: "Invalid Nickname",
                description: "Nickname must be between 3 and 30 characters.",
            });
            return false;
        }

        if (data.weight <= 0 || data.height <= 0) {
            toast({
                title: "Invalid Measurements",
                description: "Weight and height must be greater than zero.",
            });
            return false;
        }

        return true;
    };


    const canGoNext = (): boolean => {
        switch (currentStep.id) {
            case "gender":
                return !!data.gender.trim();
            case "birthdate":
                return !!data.birthdate && isAtLeast13AtMost100(data.birthdate);
            case "measurement":
                return ["metric", "imperial"].includes(data.measurement);
            case "weight":
                return data.weight > 0;
            case "height":
                return data.height > 0;
            case "activity":
                return !!data.activity.trim();
            case "nickname":
                return !!data.nickname.trim() && data.nickname.length <= 30 && data.nickname.length >= 3;
            default:
                return true;
        }
    };

    const handleChange = (key: string, value: any) => {
        const updatedData = { ...data, [key]: value };
        updateData(updatedData);
        saveProgress(currentStepIndex, updatedData); // Save updated data
    };

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
                        {isSubmitting && (
                            <div className="text-center mt-4 text-sm text-gray-500">
                                Submitting your information...
                            </div>
                        )}
                    </StepCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SetupWizard;
