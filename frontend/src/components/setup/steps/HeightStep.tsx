import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cmToInches, inchesToCm } from "@/utils/setupUtils";

interface HeightStepProps {
    height: number;
    heightUnit: "cm" | "in";
    onChange: (key: string, value: any) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({ height, heightUnit, onChange }) => {
    const minHeightCm = 100;
    const maxHeightCm = 220;
    const stepCm = 1;

    const [currentHeightCm, setCurrentHeightCm] = useState(() =>
        heightUnit === "cm" ? height : inchesToCm(height)
    );

    useEffect(() => {
        const displayHeight = heightUnit === "cm" ? currentHeightCm : cmToInches(currentHeightCm);
        onChange("height", displayHeight);
    }, [currentHeightCm, heightUnit]);

    const changeHeightBy = (amount: number) => {
        setCurrentHeightCm((current) => {
            const newVal = current + amount;
            return Math.min(Math.max(newVal, minHeightCm), maxHeightCm);
        });
    };

    const handleUnitChange = (unit: "cm" | "in") => {
        if (unit !== heightUnit) onChange("heightUnit", unit);
    };

    const displayedHeight = heightUnit === "cm" ? currentHeightCm : cmToInches(currentHeightCm);

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Unit Selection */}
            <div className="flex gap-4 mb-4">
                <Button
                    variant={heightUnit === "cm" ? "default" : "outline"}
                    onClick={() => handleUnitChange("cm")}
                >
                    CM
                </Button>
                <Button
                    variant={heightUnit === "in" ? "default" : "outline"}
                    onClick={() => handleUnitChange("in")}
                >
                    IN
                </Button>
            </div>

            {/* Increment/Decrement */}
            <div className="flex items-center justify-center space-x-2">
                <Button
                    onClick={() => changeHeightBy(-10 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#171;
                </Button>
                <Button
                    onClick={() => changeHeightBy(-1 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8249;
                </Button>

                <div className="text-6xl font-bold text-orange-500 scale-110 mx-4">
                    {displayedHeight}
                </div>

                <Button
                    onClick={() => changeHeightBy(1 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8250;
                </Button>
                <Button
                    onClick={() => changeHeightBy(10 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#187;
                </Button>
            </div>
        </div>
    );
};
