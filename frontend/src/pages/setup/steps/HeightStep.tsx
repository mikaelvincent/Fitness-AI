import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface HeightStepProps {
    height: number;
    heightUnit: "cm" | "in";
    onChange: (key: string, value: any) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({ height, heightUnit, onChange }) => {
    const minCm = 100;
    const maxCm = 220;
    const minIn = 39; // ~100cm
    const maxIn = 87; // ~220cm

    const displayedValue = heightUnit === "cm" ? height : Math.round(height / 2.54);

    const handleSliderChange = (val: number) => {
        if (heightUnit === "cm") {
            onChange("height", val);
        } else {
            // convert inches back to cm
            onChange("height", Math.round(val * 2.54));
        }
    };

    const handleUnitToggle = (unit: "cm" | "in") => {
        if (unit === "cm" && heightUnit !== "cm") {
            // Convert from inches to cm
            onChange("height", Math.round(height * 2.54));
            onChange("heightUnit", "cm");
        } else if (unit === "in" && heightUnit !== "in") {
            // Convert from cm to inches
            onChange("height", Math.round(height / 2.54));
            onChange("heightUnit", "in");
        }
    };

    const sliderMin = heightUnit === "cm" ? minCm : minIn;
    const sliderMax = heightUnit === "cm" ? maxCm : maxIn;

    return (
        <div className="space-y-4">
            <Label>Enter your height</Label>
            <div className="flex gap-2">
                <Button
                    variant={heightUnit === "cm" ? "default" : "outline"}
                    onClick={() => handleUnitToggle("cm")}
                >
                    cm
                </Button>
                <Button
                    variant={heightUnit === "in" ? "default" : "outline"}
                    onClick={() => handleUnitToggle("in")}
                >
                    in
                </Button>
            </div>
            <div className="flex flex-col items-center space-y-2 h-64 justify-center">
                <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={displayedValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="h-48 w-8 rotate-90 origin-center"
                    style={{ writingMode: "vertical-rl" }}
                />
                <span className="text-xl font-semibold">{displayedValue} {heightUnit}</span>
            </div>
        </div>
    );
};
