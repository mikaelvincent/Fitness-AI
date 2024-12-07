import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMars, FaVenus, FaGenderless } from "react-icons/fa";

type StepContentProps = {
    stepId: string;
    data: any;
    onChange: (key: string, value: any) => void;
};

const StepContent: React.FC<StepContentProps> = ({ stepId, data, onChange }) => {
    switch (stepId) {
        case "gender":
            return (
                <div className="space-y-6">
                    <Label htmlFor="Gender">Select your gender</Label>
                    <div className="flex justify-center gap-6">
                        {/* Male Button */}
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 border-2 transition-all ${data.gender === "male" ? "bg-orange-500 border-orange-600 text-white" : "border-gray-600 text-gray-400"
                                }`}
                            onClick={() => onChange("gender", "male")}
                        >
                            <FaMars size={30} />
                            <span className="mt-2 text-sm font-medium">Male</span>
                        </button>

                        {/* Female Button */}
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 border-2 transition-all ${data.gender === "female" ? "bg-orange-500 border-orange-600 text-white" : "border-gray-600 text-gray-400"
                                }`}
                            onClick={() => onChange("gender", "female")}
                        >
                            <FaVenus size={30} />
                            <span className="mt-2 text-sm font-medium">Female</span>
                        </button>

                        {/* Other Button
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 border-2 transition-all ${data.gender === "other" ? "bg-orange-500 border-orange-600 text-white" : "border-gray-600 text-gray-400"
                                }`}
                            onClick={() => onChange("gender", "other")}
                        >
                            <FaGenderless size={30} />
                            <span className="mt-2 text-sm font-medium">Other</span>
                        </button> */}
                    </div>
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
