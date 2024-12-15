import React from "react";
import { Input } from "@/components/ui/input";

interface NicknameProps {
    nickname: string;
    onChange: (key: string, value: any) => void;
}

export const NicknameStep: React.FC<NicknameProps> = ({ nickname, onChange }) => {
    return (
        <div className="space-y-2 text-center">
            <Input
                className="w-3/4 mx-auto text-center placeholder:text-gray-400"
                id="nickname"
                type="text"
                placeholder="Your nickname..."
                value={nickname}
                onChange={(e) => onChange("nickname", e.target.value)}
            />
        </div>
    );
};
