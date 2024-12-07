import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WeightStepProps {
    weight: number | string;
    onChange: (key: string, value: any) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({ weight, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="weight">Enter your weight (kg)</Label>
            <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => onChange("weight", e.target.value)}
            />
        </div>
    );
};
