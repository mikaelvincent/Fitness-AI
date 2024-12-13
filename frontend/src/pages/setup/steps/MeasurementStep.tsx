import React from "react";
import { Label } from "@/components/ui/label";
import { SetupData } from "../SetupContext";

interface MeasurementStepProps {
    data: SetupData;
    onChange: (key: string, value: any) => void; // Function to handle selection changes
};

export const MeasurementStep: React.FC<MeasurementStepProps> = ({ data, onChange }) => {
    const measurement = data.measurement;
    const updateData = (measurement: string) => {
        if (measurement === data.measurement) return;
        if (measurement === "metric" && data.measurement === "imperial") {
            // Convert weight from lbs to kg
            const weightInKg = Math.round(data.weight * 0.453592);
            onChange("weight", weightInKg);
            onChange("weightUnit", "kg");

            // Convert height from inches to cm
            const heightInCm = Math.round(data.height * 2.54);
            onChange("height", heightInCm);
            onChange("heightUnit", "cm");
        } else if (measurement === "imperial" && data.measurement === "metric") {
            // Convert weight from kg to lbs
            const weightInLbs = Math.round(data.weight * 2.20462);
            onChange("weight", weightInLbs);
            onChange("weightUnit", "lbs");

            // Convert height from cm to inches
            const heightInInches = Math.round(data.height / 2.54);
            onChange("height", heightInInches);
            onChange("heightUnit", "in");
        }
        onChange("measurement", measurement);
    }

    return (
        <div className="space-y-6">
            <Label htmlFor="Measurement">Select your measurement system</Label>
            <div className="flex justify-center gap-6">
                <button
                    className={`flex flex-col items-center justify-center p-4 rounded-lg w-28 h-28 border-2 transition-all ${measurement === "metric"
                        ? "bg-orange-500 border-orange-600 text-white"
                        : "border-gray-300 text-gray-600"
                        }`}
                    onClick={() => updateData("metric")}
                >
                    <span className="text-lg font-semibold">Metric</span>
                    <span className="text-xs">(kg, cm)</span>
                </button>

                {/* Imperial Button */}
                <button
                    className={`flex flex-col items-center justify-center p-4 rounded-lg w-28 h-28 border-2 transition-all ${measurement === "imperial"
                        ? "bg-orange-500 border-orange-600 text-white"
                        : "border-gray-300 text-gray-600"
                        }`}
                    onClick={() => updateData("imperial")}
                >
                    <span className="text-lg font-semibold">Imperial</span>
                    <span className="text-xs">(lbs, inches)</span>
                </button>
            </div>
        </div>
    );
};