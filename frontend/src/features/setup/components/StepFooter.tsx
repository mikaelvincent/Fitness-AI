import React from "react";
import { Button } from "@/shared/components/ui/button";

type StepFooterProps = {
    onPrev: () => void;
    onNext: () => void;
    onFinish: () => void;
    canGoNext: boolean;
    isLastStep: boolean;
    isFirstStep: boolean;
};

const StepFooter: React.FC<StepFooterProps> = ({ onPrev, onNext, onFinish, canGoNext, isLastStep, isFirstStep }) => {
    return (
        <div className="flex justify-end space-x-2">
            {!isFirstStep && (
                <Button variant="outline" onClick={onPrev}>
                    Back
                </Button>
            )}
            {!isLastStep && (
                <Button onClick={onNext} disabled={!canGoNext}>
                    Next
                </Button>
            )}
            {isLastStep && (
                <Button onClick={onFinish}>
                    Finish
                </Button>
            )}
        </div>
    );
};

export default StepFooter;
