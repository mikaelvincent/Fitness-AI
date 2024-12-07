import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BirthdateStepProps {
    birthdate: string;
    onChange: (key: string, value: any) => void;
}

export const BirthdateStep: React.FC<BirthdateStepProps> = ({ birthdate, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="birthdate">Enter your birthdate</Label>
            <Input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => onChange("birthdate", e.target.value)}
            />
        </div>
    );
};
