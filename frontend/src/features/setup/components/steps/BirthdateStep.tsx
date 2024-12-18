import React, { useState, useEffect } from "react";
import { isAtLeast13AtMost100 } from "@/shared/utils/setupUtils";

interface BirthdateStepProps {
    birthdate: string;
    onChange: (key: string, value: string) => void;
}

export const BirthdateStep: React.FC<BirthdateStepProps> = ({ birthdate, onChange }) => {
    const [localValue, setLocalValue] = useState(birthdate);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        // Validate the initial birthdate if provided.
        if (localValue && !isAtLeast13AtMost100(localValue)) {
            setError("Please enter a valid birthdate. You must be at least 13 years old.");
        } else {
            setError("");
        }
    }, [localValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalValue(value);

        // Validate as the user changes the input
        if (value && !isAtLeast13AtMost100(value)) {
            setError("Please enter a valid birthdate. You must be at least 13 years old.");
        } else {
            setError("");
        }

        onChange("birthdate", value);
    };

    return (
        <div className="flex flex-col space-y-3 items-center">
            <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={localValue}
                onChange={handleInputChange}
                aria-describedby={error ? "birthdate-error" : undefined}
                className={`border rounded-md max-w-40 p-2 bg-inherit focus:outline-none 
                    ${error ? "border-red-500 focus:ring-red-500" : ""}`
                }
                placeholder="YYYY-MM-DD"
                required
            />
            {error && (
                <p id="birthdate-error" className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};
