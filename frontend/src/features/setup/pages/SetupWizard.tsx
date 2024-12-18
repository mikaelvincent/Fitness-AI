import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/shared/hooks/use-toast";
import { useSetupData } from "@/features/setup/components/SetupContext";
import { updateUserAttributes } from "@/shared/services/userAttributesService";
import { steps } from "./stepsConfig";
import StepContent from "@/features/setup/components/StepContent";
import { StepCard } from "@/features/setup/components/StepCard";
import { isAtLeast13AtMost100 } from "@/shared/utils/setupUtils";

export const SetupWizard: React.FC = () => {
  const { data, updateData } = useSetupData();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedStep = sessionStorage.getItem("currentStepIndex");
    const savedData = sessionStorage.getItem("setupData");

    if (savedStep) {
      setCurrentStepIndex(Number(savedStep));
    }
    if (savedData) {
      updateData(JSON.parse(savedData));
    }
  }, [updateData]);

  const currentStep = steps[currentStepIndex];

  const saveProgress = (index: number, newData: any) => {
    sessionStorage.setItem("currentStepIndex", index.toString());
    sessionStorage.setItem("setupData", JSON.stringify(newData));
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

      sessionStorage.removeItem("currentStepIndex");
      sessionStorage.removeItem("setupData");

      navigate("/verify-email");
    } catch (error: any) {
      console.error("Error:", error.message);
      const errorMsg =
        error.message === "Authentication token not found."
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
        description:
          "Please ensure all fields are filled out correctly before finishing.",
      });
      return;
    }

    navigate("/verify-email");
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
      if (
        !data[field] ||
        (typeof data[field] === "string" && !data[field].trim())
      ) {
        return false;
      }
    }

    if (!isAtLeast13AtMost100(data.birthdate)) {
      toast({
        title: "Invalid Birthdate",
        description: "Please enter a valid birthdate.",
      });
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
        return (
          !!data.nickname.trim() &&
          data.nickname.length <= 30 &&
          data.nickname.length >= 3
        );
      default:
        return true;
    }
  };

  const handleChange = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    updateData(updatedData);
    saveProgress(currentStepIndex, updatedData);
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="mx-auto w-full max-w-lg">
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
            <StepContent
              stepId={currentStep.id}
              data={data}
              onChange={handleChange}
              setCurrentStep={setCurrentStepIndex}
            />
            {isSubmitting && (
              <div className="mt-4 text-center text-sm text-gray-500">
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
