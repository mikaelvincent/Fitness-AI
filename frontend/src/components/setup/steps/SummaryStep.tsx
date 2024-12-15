// src/pages/setup/steps/SummaryStep.tsx
import React from "react";
import { SetupData } from "@/types/setupTypes";

interface SummaryStepProps {
    data: SetupData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
    const {
        gender,
        birthdateDay,
        birthdateMonth,
        birthdateYear,
        measurement,
        weight,
        weightUnit,
        height,
        heightUnit,
        activity,
        nickname,
    } = data;

    const birthdateString = `${birthdateYear}-${birthdateMonth.padStart(2, "0")}-${birthdateDay.padStart(2, "0")}`;
    const displayedWeight = `${weight}${weightUnit}`;
    const displayedHeight = `${height}${heightUnit}`;

    const info = [
        { label: "Gender", value: gender },
        { label: "Birthdate", value: birthdateString },
        { label: "Measurement", value: measurement },
        { label: "Weight", value: displayedWeight },
        { label: "Height", value: displayedHeight },
        { label: "Activity Level", value: activity },
        { label: "Nickname", value: nickname },
    ];

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {info.map((item) => (
                    <div key={item.label} className="p-4 border rounded-lg">
                        <strong>{item.label}:</strong> {item.value}
                    </div>
                ))}
            </div>
        </div>
    );
};
