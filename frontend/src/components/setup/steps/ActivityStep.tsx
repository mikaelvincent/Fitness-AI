// src/pages/setup/steps/ActivityStep.tsx
import React from "react";
import clsx from "clsx";

interface ActivityStepProps {
    activity: string;
    onChange: (key: string, value: any) => void;
}

const activities = [
    { value: "sedentary", label: "Sedentary" },
    { value: "light", label: "Lightly Active" },
    { value: "moderate", label: "Moderately Active" },
    { value: "active", label: "Very Active" },
];

export const ActivityStep: React.FC<ActivityStepProps> = ({ activity, onChange }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {activities.map((act) => (
                    <button
                        key={act.value}
                        onClick={() => onChange("activity", act.value)}
                        className={clsx(
                            "p-4 rounded-lg border-2 transition-all text-center",
                            activity === act.value
                                ? "bg-orange-500 border-orange-600 text-white"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        {act.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
