import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import clsx from "clsx";

interface GenderStepProps {
    gender: string;
    onChange: (key: string, value: any) => void;
}

export const GenderStep: React.FC<GenderStepProps> = ({ gender, onChange }) => {
    const options = [
        { value: "male", label: "Male", Icon: FaMars },
        { value: "female", label: "Female", Icon: FaVenus },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-6">
                {options.map(({ value, label, Icon }) => (
                    <button
                        key={value}
                        onClick={() => onChange("gender", value)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 border-2 transition-all",
                            gender === value
                                ? "bg-orange-500 border-orange-600 text-white"
                                : "border-gray-600 text-gray-400 hover:bg-gray-100"
                        )}
                    >
                        <Icon size={30} />
                        <span className="mt-2 text-sm font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
