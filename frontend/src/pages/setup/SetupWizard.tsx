import React, { useState } from "react";
import { useSetupData } from "./SetupContext";
import { StepCard } from "@/components/setup/StepCard";
import StepContent from "./StepContent";
// import StepFooter from "./StepFooter.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const steps = [
    { id: "gender", title: "What's your gender?" },
    { id: "birthdate", title: "What's your birthdate?" },
    { id: "weight", title: "What's your weight?" },
    { id: "height", title: "What's your height?" },
    { id: "activity", title: "What's your level of physical activity?" },
    { id: "username", title: "Choose a username" },
    { id: "summary", title: "Review Your Information" },
];

const SetupWizard = () => {
    const { data, updateData } = useSetupData();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const navigate = useNavigate();

    const step = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const isFirstStep = currentStepIndex === 0;

    const nextStep = () => setCurrentStepIndex((i) => i + 1);
    const prevStep = () => setCurrentStepIndex((i) => i - 1);

    const finish = () => {
        console.log("User data submitted:", data);
        navigate("/");
    };

    const canGoNext = () => {
        switch (step.id) {
            case "gender": return data.gender !== "";
            case "birthdate": return data.birthdate !== "";
            case "weight": return data.weight !== "";
            case "height": return data.height !== "";
            case "activity": return data.activity !== "";
            case "username": return data.username !== "";
            default: return true;
        }
    };

    const handleChange = (key: string, value: any) => updateData({ [key]: value });

    return (
        <div className="relative w-full max-w-lg mx-auto">
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
                    >
                        {/* StepContent now passed as children */}
                        <StepContent stepId={step.id} data={data} onChange={handleChange} />
                    </StepCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );

};

export default SetupWizard;
