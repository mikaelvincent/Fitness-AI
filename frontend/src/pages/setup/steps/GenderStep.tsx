import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";

interface GenderStepProps {
    gender: string;
    onChange: (key: string, value: any) => void;
}

export const GenderStep: React.FC<GenderStepProps> = ({ gender, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-6">
                {/* Male Button */}
                <button
                    className={`flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 border-2 transition-all ${gender === "male" ? "bg-orange-500 border-orange-600 text-white" : "border-gray-600 text-gray-400"
                        }`}
                    onClick={() => onChange("gender", "male")}
                >
                    <FaMars size={30} />
                    <span className="mt-2 text-sm font-medium">Male</span>
                </button>

                {/* Female Button */}
                <button
                    className={`flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 border-2 transition-all ${gender === "female" ? "bg-orange-500 border-orange-600 text-white" : "border-gray-600 text-gray-400"
                        }`}
                    onClick={() => onChange("gender", "female")}
                >
                    <FaVenus size={30} />
                    <span className="mt-2 text-sm font-medium">Female</span>
                </button>
            </div>
        </div>
    );
};
