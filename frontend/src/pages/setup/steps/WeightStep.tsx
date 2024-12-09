import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface WeightStepProps {
    weight: number;
    weightUnit: "kg" | "lbs";
    onChange: (key: string, value: any) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({ weight, weightUnit, onChange }) => {
    const minWeightKg = 30;
    const maxWeightKg = 200;
    const stepKg = 1;

    // Precise conversion functions
    const toLbs = (kg: number) => Math.round(kg * 2.20462);
    const toKg = (lbs: number) => Math.round(lbs / 2.20462);

    // Determine initial state based on input props
    const [currentWeightKg, setCurrentWeightKg] = useState(() => {
        return weightUnit === "kg" ? weight : toKg(weight);
    });

    // Conversion and display function
    const getDisplayWeight = (weightInKg: number) => {
        return weightUnit === "kg" ? Math.round(weightInKg) : toLbs(weightInKg);
    };

    // Update parent component when weight or unit changes
    useEffect(() => {
        onChange("weight", getDisplayWeight(currentWeightKg));
    }, [currentWeightKg, weightUnit]);

    const changeWeightBy = (amount: number) => {
        setCurrentWeightKg(current => {
            const newVal = current + amount;
            return Math.min(Math.max(newVal, minWeightKg), maxWeightKg);
        });
    };

    const handleUnitChange = (unit: "kg" | "lbs") => {
        if (unit !== weightUnit) {
            onChange("weightUnit", unit);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
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
            <div className="flex items-center justify-center">
                {/* Double decrement by 10 */}
                <Button
                    onClick={() => changeWeightBy(-10 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#171;
                </Button>
                {/* Single decrement by 1 */}
                <Button
                    onClick={() => changeWeightBy(-1 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8249;
                </Button>
                <div className="flex items-center space-x-6">
                    <div className="text-6xl font-bold text-orange-500 scale-110">
                        {getDisplayWeight(currentWeightKg)}
                    </div>
                </div>
                {/* Single increment by 1 */}
                <Button
                    onClick={() => changeWeightBy(1 * stepKg)}
                    variant="ghost"
                    className="text-3xl text-gray-400 hover:text-orange-500"
                >
                    &#8250;
                </Button>
                {/* Double increment by 10 */}
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
