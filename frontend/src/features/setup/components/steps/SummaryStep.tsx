import React from "react";
import { SetupData } from "@/features/setup/types/setupTypes";

interface SummaryStepProps {
    data: SetupData;
    setCurrentStep: (stepId: number) => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data, setCurrentStep }) => {
    const {
        gender,
        birthdate,
        measurement,
        weight,
        weightUnit,
        height,
        heightUnit,
        activity,
        nickname,
    } = data;

    const birthdateString = `${birthdate}`;
    const displayedWeight = `${weight}${weightUnit}`;
    const displayedHeight = `${height}${heightUnit}`;

    const info = [
        { label: "Gender", value: gender, index: 0 },
        { label: "Birthdate", value: birthdateString, index: 1 },
        { label: "Measurement", value: measurement, index: 2 },
        { label: "Weight", value: displayedWeight, index: 3 },
        { label: "Height", value: displayedHeight, index: 4 },
        { label: "Activity Level", value: activity, index: 5 },
        { label: "Nickname", value: nickname, index: 6 },
    ];

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {info.map((item) => (
                    <div key={item.label} className="p-4 border rounded-lg hover:bg-primary">
                        <button onClick={() => setCurrentStep(item.index)} className="w-full text-left">
                            <strong>{item.label}:</strong> {item.value}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
