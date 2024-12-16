import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface NicknameProps {
    nickname: string;
    onChange: (key: string, value: any) => void;
}

export const NicknameStep: React.FC<NicknameProps> = ({ nickname, onChange }) => {
    const [error, setError] = useState<string>("");

    const MAX_LENGTH = 30;
    const MIN_LENGTH = 3;

    const validateNickname = (value: string) => {
        if (value.length < MIN_LENGTH) {
            setError("Nickname must be at least 3 characters long.");
        } else if (value.length > MAX_LENGTH) {
            setError("Nickname cannot exceed 50 characters.");
        } else {
            setError("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        validateNickname(value);
        onChange("nickname", value);
    };

    useEffect(() => {
        validateNickname(nickname);
    }, [nickname]);

    return (
        <div className="space-y-4 text-center">
            <Input
                className={`w-3/4 mx-auto text-center`}
                id="nickname"
                type="text"
                placeholder="Your nickname..."
                value={nickname}
                maxLength={MAX_LENGTH}
                onChange={handleInputChange}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};
