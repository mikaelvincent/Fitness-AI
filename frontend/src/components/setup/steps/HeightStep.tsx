import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HeightStepProps {
    height: number;
    heightUnit: "cm" | "in";
    onChange: (key: string, value: any) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({ height, heightUnit, onChange }) => {
    const minHeightCm = 100;
    const maxHeightCm = 220;
    const stepCm = 1;

    const toInches = (cm: number) => Math.round(cm / 2.54);
    const toCm = (inches: number) => Math.round(inches * 2.54);

    const [currentHeightCm, setCurrentHeightCm] = useState(() =>
        heightUnit === "cm" ? height : toCm(height)
    );

    const getDisplayHeight = (heightInCm: number) => {
        return heightUnit === "cm" ? heightInCm : toInches(heightInCm);
    };

    useEffect(() => {
        onChange("height", getDisplayHeight(currentHeightCm));
    }, [currentHeightCm, heightUnit]);

    const changeHeightBy = (amount: number) => {
        setCurrentHeightCm((current) => {
            const newVal = current + amount;
            return Math.min(Math.max(newVal, minHeightCm), maxHeightCm);
        });
    };

    const handleUnitChange = (unit: "cm" | "in") => {
        if (unit !== heightUnit) {
            onChange("heightUnit", unit);
        }
    };

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

            {/* Increment/Decrement Section */}
            <div className="flex items-center">
                {/* Double decrement by 10 */}
                <Button
                    onClick={() => changeHeightBy(-10 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#171;
                </Button>
                {/* Single decrement by 1 */}
                <Button
                    onClick={() => changeHeightBy(-1 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8249;
                </Button>

                {/* Display Heights */}
                <div className="flex items-center space-x-6">
                    <div className="text-6xl font-bold text-orange-500 scale-110">
                        {getDisplayHeight(currentHeightCm)}
                    </div>
                </div>

                {/* Single increment by 1 */}
                <Button
                    onClick={() => changeHeightBy(1 * stepCm)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8250;
                </Button>
                {/* Double increment by 10 */}
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
