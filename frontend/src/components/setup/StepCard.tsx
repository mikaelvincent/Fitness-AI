// src/pages/setup/StepCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/custom-ui/BackButton";
import { useNavigate } from "react-router-dom";

interface StepCardProps {
    title: string;
    children: React.ReactNode;
    onPrev?: () => void;
    onNext?: () => void;
    onFinish?: () => void;
    canGoNext?: boolean;
    isLastStep?: boolean;
    isFirstStep?: boolean;
    isSubmitting?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({
    title,
    children,
    onPrev,
    onNext,
    onFinish,
    canGoNext = true,
    isLastStep = false,
    isFirstStep = false,
    isSubmitting = false,
}) => {
    const navigate = useNavigate();
    return (
        <Card className="w-full mx-auto border-0">
            <CardHeader className="flex justify-center p-4">
                <div className="flex items-center justify-start p-2">
                    {!isFirstStep && <BackButton onClick={onPrev} />}
                </div>
                <div className="flex items-center justify-start p-2">
                    {isFirstStep && <BackButton onClick={() => navigate('/login')} />}
                </div>
                <CardTitle className="text-3xl lg:text-4xl text-center w-full p-2">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-4">{children}</CardContent>

            <CardFooter className="flex justify-center space-x-2 p-4">
                {!isLastStep && (
                    <Button onClick={onNext} disabled={!canGoNext}>
                        Next
                    </Button>
                )}
                {isLastStep && (
                    <Button onClick={onFinish} disabled={!canGoNext || isSubmitting}>
                        Next
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};
