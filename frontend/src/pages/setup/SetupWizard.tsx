import React, { useState } from "react";
import { useSetupData } from "./SetupContext";
import { StepCard } from "@/components/setup/StepCard";
import StepContent from "./StepContent";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // To fetch the token from cookies
import { updateUserAttributes, AttributesSchema } from "@/utils/api/updateUserAttributes";

const steps = [
    { id: "gender", title: "What's your gender?" },
    { id: "birthdate", title: "When's your birthdate?" },
    { id: "measurement", title: "Preferred Measurement" },
    { id: "weight", title: "What's your weight?" },
    { id: "height", title: "What's your height?" },
    { id: "activity", title: "What's your level of physical activity?" },
    { id: "nickname", title: "Set your nickname" },
    { id: "summary", title: "Review Your Information" },
];

const SetupWizard = () => {
    const { data, updateData } = useSetupData();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
    const navigate = useNavigate();

    const step = steps[currentStepIndex];

    const nextStep = () => setCurrentStepIndex((i) => i + 1);
    const prevStep = () => setCurrentStepIndex((i) => i - 1);



    const finish = async () => {
        console.log("Submitting user data:", data);

        // Set the submission state to true
        setIsSubmitting(true);

        try {
            // Get token from cookies
            const token = Cookies.get("token");

            if (!token) {
                alert("Authentication token not found. Please log in again.");
                return;
            }

            // Prepare the payload as key-value pairs
            const payload = {
                gender: data.gender,
                birthdate: `${data.birthdateYear}-${data.birthdateMonth}-${data.birthdateDay}`,
                measurement: data.measurement,
                weight: `${data.weight} ${data.measurement === "metric" ? "kg" : "lbs"}`,
                height: `${data.height} ${data.measurement === "metric" ? "cm" : "inches"}`,
                activity: data.activity,
                nickname: data.nickname,
            };

            // Validate the payload (optional, ensures correct format)
            const validationResult = AttributesSchema.safeParse(payload);

            if (!validationResult.success) {
                console.error("Validation failed:", validationResult.error);
                alert("Invalid data provided.");
                return;
            }

            // Call the API
            const result = await updateUserAttributes(validationResult.data, token);

            if (result.success) {
                console.log("Attributes updated:", result.message);
                alert("User attributes updated successfully!");
                navigate("/");
            } else {
                console.error("Update failed:", result.message);
                alert(result.message || "Failed to update user attributes.");
            }
        } catch (error) {
            console.error("Unexpected error during submission:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            // Reset the submission state to false
            setIsSubmitting(false);
        }
    };



    const isAtLeast13AtMost100 = (): boolean => {
        const { birthdateDay, birthdateMonth, birthdateYear } = data;
        if (!birthdateDay || !birthdateMonth || !birthdateYear) return false;

        const birthDate = new Date(
            Number(birthdateYear),
            Number(birthdateMonth) - 1,
            Number(birthdateDay)
        );
        if (isNaN(birthDate.getTime())) return false;

        const today = new Date();
        const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

        return birthDate <= thirteenYearsAgo && birthDate >= hundredYearsAgo;
    };

    const canGoNext = (): boolean => {
        switch (step.id) {
            case "gender":
                return data.gender.trim() !== "";
            case "birthdate":
                return (
                    data.birthdateDay.trim() !== "" &&
                    data.birthdateMonth.trim() !== "" &&
                    data.birthdateYear.trim() !== "" &&
                    isAtLeast13AtMost100()
                );
            case "measurement":
                return data.measurement === "imperial" || data.measurement === "metric";
            case "weight":
                return data.weight > 0;
            case "height":
                return data.height > 0;
            case "activity":
                return data.activity.trim() !== "";
            case "nickname":
                return data.nickname.trim() !== "";
            default:
                return true;
        }
    };

    const handleChange = (key: string, value: any) => updateData({ [key]: value });

    return (
        <div className="w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <StepCard
                        title={step.title}
                        onPrev={prevStep}
                        onNext={nextStep}
                        onFinish={finish}
                        canGoNext={canGoNext()}
                        isFirstStep={currentStepIndex === 0}
                        isLastStep={currentStepIndex === steps.length - 1}
                        isSubmitting={isSubmitting} // Disable button during submission
                    >
                        <StepContent stepId={step.id} data={data} onChange={handleChange} />
                    </StepCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SetupWizard;
