import React from "react";
import { SetupData } from "../SetupContext";

interface SummaryStepProps {
    data: SetupData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
    // Convert birthdate fields into a proper date format
    const { birthdateDay, birthdateMonth, birthdateYear, weight, weightUnit, height, heightUnit } = data;
    const birthdateString = `${birthdateYear}-${birthdateMonth.padStart(2, "0")}-${birthdateDay.padStart(2, "0")}`;

    // Convert units if needed for display
    const displayedWeight = `${weight}${weightUnit}`;
    const displayedHeight = `${height}${heightUnit}`;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4">Review Your Information</h2>
            <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                    <strong>Gender:</strong> {data.gender}
                </div>
                <div className="p-4 border rounded-lg">
                    <strong>Birthdate:</strong> {birthdateString}
                </div>
                <div className="p-4 border rounded-lg">
                    <strong>Measurement:</strong> {data.measurement}
                </div>
                <div className="p-4 border rounded-lg">
                    <strong>Weight:</strong> {displayedWeight}
                </div>
                <div className="p-4 border rounded-lg">
                    <strong>Height:</strong> {displayedHeight}
                </div>
                <div className="p-4 border rounded-lg">
                    <strong>Activity Level:</strong> {data.activity}
                </div>
                <div className="p-4 border rounded-lg">
                    <strong>Nickname:</strong> {data.nickname}
                </div>
            </div>
        </div>
    );
};
