import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HeightStepProps {
    height: number | string;
    onChange: (key: string, value: any) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({ height, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="height">Enter your height (cm)</Label>
            <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => onChange("height", e.target.value)}
            />
        </div>
    );
};
