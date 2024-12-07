import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StepContentProps = {
    stepId: string;
    data: any;
    onChange: (key: string, value: any) => void;
};

const StepContent: React.FC<StepContentProps> = ({ stepId, data, onChange }) => {
    switch (stepId) {
        case "gender":
            return (
                <div className="space-y-2">
                    <Label htmlFor="gender">Select your gender</Label>
                    <Select onValueChange={(val) => onChange("gender", val)} defaultValue={data.gender}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );

        case "birthdate":
            return (
                <div className="space-y-2">
                    <Label htmlFor="birthdate">Enter your birthdate</Label>
                    <Input
                        id="birthdate"
                        type="date"
                        value={data.birthdate}
                        onChange={(e) => onChange("birthdate", e.target.value)}
                    />
                </div>
            );

        case "weight":
            return (
                <div className="space-y-2">
                    <Label htmlFor="weight">Enter your weight (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        value={data.weight}
                        onChange={(e) => onChange("weight", Number(e.target.value))}
                    />
                </div>
            );

        case "height":
            return (
                <div className="space-y-2">
                    <Label htmlFor="height">Enter your height (cm)</Label>
                    <Input
                        id="height"
                        type="number"
                        value={data.height}
                        onChange={(e) => onChange("height", Number(e.target.value))}
                    />
                </div>
            );

        case "activity":
            return (
                <div className="space-y-2">
                    <Label htmlFor="activity">Select your activity level</Label>
                    <Select onValueChange={(val) => onChange("activity", val)} defaultValue={data.activity}>
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

        case "username":
            return (
                <div className="space-y-2">
                    <Label htmlFor="username">Enter your preferred username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={(e) => onChange("username", e.target.value)}
                    />
                </div>
            );

        case "summary":
            return (
                <div className="space-y-4">
                    <p><strong>Gender:</strong> {data.gender}</p>
                    <p><strong>Birthdate:</strong> {data.birthdate}</p>
                    <p><strong>Weight:</strong> {data.weight} kg</p>
                    <p><strong>Height:</strong> {data.height} cm</p>
                    <p><strong>Activity Level:</strong> {data.activity}</p>
                    <p><strong>Username:</strong> {data.username}</p>
                </div>
            );

        default:
            return null;
    }
};

export default StepContent;
