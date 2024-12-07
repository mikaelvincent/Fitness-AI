import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityStepProps {
    activity: string;
    onChange: (key: string, value: any) => void;
}

export const ActivityStep: React.FC<ActivityStepProps> = ({ activity, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="activity">Select your activity level</Label>
            <Select onValueChange={(val) => onChange("activity", val)} defaultValue={activity}>
                <SelectTrigger id="activity">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Very Active</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
