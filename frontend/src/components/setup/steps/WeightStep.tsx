// src/pages/setup/steps/WeightStep.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { kgToLbs, lbsToKg } from "@/utils/setupUtils";

interface WeightStepProps {
    weight: number;
    weightUnit: "kg" | "lbs";
    onChange: (key: string, value: any) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({ weight, weightUnit, onChange }) => {
    const minWeightKg = 30;
    const maxWeightKg = 200;
    const stepKg = 1;

    const [currentWeightKg, setCurrentWeightKg] = useState(() =>
        weightUnit === "kg" ? weight : lbsToKg(weight)
    );

    useEffect(() => {
        const displayWeight = weightUnit === "kg" ? currentWeightKg : kgToLbs(currentWeightKg);
        onChange("weight", displayWeight);
    }, [currentWeightKg, weightUnit]);

    const changeWeightBy = (amount: number) => {
        setCurrentWeightKg((current) => {
            const newVal = current + amount;
            return Math.min(Math.max(newVal, minWeightKg), maxWeightKg);
        });
    };

    const handleUnitChange = (unit: "kg" | "lbs") => {
        if (unit !== weightUnit) onChange("weightUnit", unit);
    };

    const displayedWeight = weightUnit === "kg" ? currentWeightKg : kgToLbs(currentWeightKg);

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Unit Selection */}
            <div className="flex gap-4 mb-4">
                <Button
                    variant={weightUnit === "kg" ? "default" : "outline"}
                    onClick={() => handleUnitChange("kg")}
                >
                    KG
                </Button>
                <Button
                    variant={weightUnit === "lbs" ? "default" : "outline"}
                    onClick={() => handleUnitChange("lbs")}
                >
                    LB
                </Button>
            </div>

            {/* Increment/Decrement */}
            <div className="flex items-center justify-center space-x-2">
                <Button
                    onClick={() => changeWeightBy(-10 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#171;
                </Button>
                <Button
                    onClick={() => changeWeightBy(-1 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8249;
                </Button>

                <div className="text-6xl font-bold text-orange-500 scale-110 mx-4">
                    {displayedWeight}
                </div>

                <Button
                    onClick={() => changeWeightBy(1 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8250;
                </Button>
                <Button
                    onClick={() => changeWeightBy(10 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#187;
                </Button>
            </div>
        </div>
    );
};
