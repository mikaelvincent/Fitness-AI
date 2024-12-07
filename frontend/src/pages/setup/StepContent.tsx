import React from "react";
import { SetupData } from "./SetupContext";
import { GenderStep } from "./steps/GenderStep";
import { BirthdateStep } from "./steps/BirthdateStep";
import { WeightStep } from "./steps/WeightStep";
import { HeightStep } from "./steps/HeightStep";
import { ActivityStep } from "./steps/ActivityStep";
import { UsernameStep } from "./steps/UsernameStep";
import { SummaryStep } from "./steps/SummaryStep";

interface StepContentProps {
    stepId: string;
    data: SetupData;
    onChange: (key: string, value: any) => void;
}

const StepContent: React.FC<StepContentProps> = ({ stepId, data, onChange }) => {
    switch (stepId) {
        case "gender":
            return <GenderStep gender={data.gender} onChange={onChange} />;
        case "birthdate":
            return <BirthdateStep birthdate={data.birthdate} onChange={onChange} />;
        case "weight":
            return <WeightStep weight={data.weight} onChange={onChange} />;
        case "height":
            return <HeightStep height={data.height} onChange={onChange} />;
        case "activity":
            return <ActivityStep activity={data.activity} onChange={onChange} />;
        case "username":
            return <UsernameStep username={data.username} onChange={onChange} />;
        case "summary":
            return <SummaryStep data={data} />;
        default:
            return null;
    }
};

export default StepContent;
