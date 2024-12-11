import React from "react";
import { Label } from "@/components/ui/label";

interface MeasurementStepProps {
    measurement: "metric" | "imperial"; // Current selected value
    onChange: (key: string, value: string) => void; // Function to handle selection changes
};

export const MeasurementStep: React.FC<MeasurementStepProps> = ({ measurement, onChange }) => {
    return (
        <div className="space-y-6">
            <Label htmlFor="Measurement">Select your measurement system</Label>
            <div className="flex justify-center gap-6">
                <button
                    className={`flex flex-col items-center justify-center p-4 rounded-lg w-28 h-28 border-2 transition-all ${measurement === "metric"
                        ? "bg-orange-500 border-orange-600 text-white"
                        : "border-gray-300 text-gray-600"
                        }`}
                    onClick={() => onChange("measurement", "metric")}
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
                    onClick={() => onChange("measurement", "imperial")}
                >
                    <span className="text-lg font-semibold">Imperial</span>
                    <span className="text-xs">(lbs, inches)</span>
                </button>
            </div>
        </div>
    );
};