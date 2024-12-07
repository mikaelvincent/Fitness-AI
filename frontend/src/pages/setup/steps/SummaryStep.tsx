import React from "react";
import { SetupData } from "../SetupContext";

interface SummaryStepProps {
    data: SetupData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
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
};
