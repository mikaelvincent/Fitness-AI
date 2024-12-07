import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeightStepProps {
    weight: number;
    weightUnit: "kg" | "lbs";
    onChange: (key: string, value: any) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({ weight, weightUnit, onChange }) => {
    const minKg = 30;
    const maxKg = 200;
    const minLbs = 66; // ~30kg
    const maxLbs = 441; // ~200kg

    const displayedValue = weightUnit === "kg" ? weight : Math.round(weight * 2.205);

    const handleSliderChange = (val: number) => {
        if (weightUnit === "kg") {
            onChange("weight", val);
        } else {
            // convert lbs back to kg
            onChange("weight", Math.round(val / 2.205));
        }
    };

    const handleUnitToggle = (unit: "kg" | "lbs") => {
        if (unit === "kg" && weightUnit !== "kg") {
            // Convert from lbs to kg
            onChange("weight", Math.round(weight / 2.205));
            onChange("weightUnit", "kg");
        } else if (unit === "lbs" && weightUnit !== "lbs") {
            // Convert from kg to lbs
            onChange("weight", Math.round(weight * 2.205));
            onChange("weightUnit", "lbs");
        }
    };

    const sliderMin = weightUnit === "kg" ? minKg : minLbs;
    const sliderMax = weightUnit === "kg" ? maxKg : maxLbs;

    return (
        <div className="space-y-4">
            <Label>Enter your weight</Label>
            <div className="flex gap-2">
                <Button
                    variant={weightUnit === "kg" ? "default" : "outline"}
                    onClick={() => handleUnitToggle("kg")}
                >
                    kg
                </Button>
                <Button
                    variant={weightUnit === "lbs" ? "default" : "outline"}
                    onClick={() => handleUnitToggle("lbs")}
                >
                    lbs
                </Button>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <Input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={displayedValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full"
                />
                <span className="text-xl font-semibold">{displayedValue} {weightUnit}</span>
            </div>
        </div>
    );
};
