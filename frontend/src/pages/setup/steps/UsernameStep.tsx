import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UsernameStepProps {
    username: string;
    onChange: (key: string, value: any) => void;
}

export const UsernameStep: React.FC<UsernameStepProps> = ({ username, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="username">Enter your preferred username</Label>
            <div className="flex justify-center">
                <Input
                    className="w-3/4"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => onChange("username", e.target.value)}
                />
            </div>
        </div>
    );
};
