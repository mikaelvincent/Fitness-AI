import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdArrowBack } from "react-icons/md";

interface StepCardProps {
    title: string;
    children: React.ReactNode;
    onPrev?: () => void;
    onNext?: () => void;
    onFinish?: () => void;
    canGoNext?: boolean;
    isLastStep?: boolean;
    isFirstStep?: boolean;
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
}) => {
    return (
        <Card className="w-full mx-auto border-0">
            <CardHeader className="flex justify-center">
                <div className="flex items-cente justify-start">
                    {!isFirstStep && (
                        <button
                            onClick={onPrev}
                            className="flex items-center text-gray-500 hover:text-gray-700"
                        >
                            <MdArrowBack size={24} className="mr-1" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                    )}
                </div>
                <CardTitle className="text-3xl lg:text-5xl text-center w-full">{title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {children}
            </CardContent>

            <CardFooter className="flex justify-center space-x-2">
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
            </CardFooter>
        </Card>
    );
};
