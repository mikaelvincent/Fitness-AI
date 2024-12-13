import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BirthdateStepProps {
    birthdateDay: string;
    birthdateMonth: string;
    birthdateYear: string;
    onChange: (key: string, value: any) => void;
}

export const BirthdateStep: React.FC<BirthdateStepProps> = ({
    birthdateDay,
    birthdateMonth,
    birthdateYear,
    onChange
}) => {
    return (
        <div className="space-y-4">
            <div className="flex space-x-2 justify-center">
                <div>
                    <Label htmlFor="day">Day</Label>
                    <Input
                        id="day"
                        type="number"
                        placeholder="DD"
                        value={birthdateDay}
                        onChange={(e) => onChange("birthdateDay", e.target.value)}
                        min="1"
                        max="31"
                    />
                </div>
                <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                        id="month"
                        type="number"
                        placeholder="MM"
                        value={birthdateMonth}
                        onChange={(e) => onChange("birthdateMonth", e.target.value)}
                        min="1"
                        max="12"
                    />
                </div>
                <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                        id="year"
                        type="number"
                        placeholder="YYYY"
                        value={birthdateYear}
                        onChange={(e) => onChange("birthdateYear", e.target.value)}
                        min="1900"
                        max={new Date().getFullYear()}
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <p className="text-sm text-gray-500">You must be at least 13 years old to continue.</p>
            </div>
        </div>
    );
};
