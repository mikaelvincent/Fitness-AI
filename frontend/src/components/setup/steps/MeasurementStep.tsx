// src/pages/setup/steps/MeasurementStep.tsx
import React from "react";
import clsx from "clsx";
import { SetupData } from "../SetupContext";
import { kgToLbs, lbsToKg, cmToInches, inchesToCm } from "../../../pages/setup/utils";

interface MeasurementStepProps {
    data: SetupData;
    onChange: (key: string, value: any) => void;
}

export const MeasurementStep: React.FC<MeasurementStepProps> = ({ data, onChange }) => {
    const { measurement } = data;

    const handleMeasurementChange = (newMeasurement: "metric" | "imperial") => {
        if (newMeasurement === measurement) return;

        if (newMeasurement === "metric" && measurement === "imperial") {
            // Convert imperial to metric
            onChange("weight", lbsToKg(data.weight));
            onChange("weightUnit", "kg");
            onChange("height", inchesToCm(data.height));
            onChange("heightUnit", "cm");
        } else if (newMeasurement === "imperial" && measurement === "metric") {
            // Convert metric to imperial
            onChange("weight", kgToLbs(data.weight));
            onChange("weightUnit", "lbs");
            onChange("height", cmToInches(data.height));
            onChange("heightUnit", "in");
        }

        onChange("measurement", newMeasurement);
    };

    const options = [
        { value: "metric", label: "Metric", subtitle: "(kg, cm)" },
        { value: "imperial", label: "Imperial", subtitle: "(lbs, inches)" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-6">
                {options.map(({ value, label, subtitle }) => (
                    <button
                        key={value}
                        onClick={() => handleMeasurementChange(value as "metric" | "imperial")}
                        className={clsx(
                            "flex flex-col items-center justify-center p-4 rounded-lg w-28 h-28 border-2 transition-all",
                            measurement === value
                                ? "bg-orange-500 border-orange-600 text-white"
                                : "border-gray-300 text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        <span className="text-lg font-semibold">{label}</span>
                        <span className="text-xs">{subtitle}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
