import React from "react";
import { GenderStep } from "./steps/GenderStep";
import { BirthdateStep } from "./steps/BirthdateStep";
import { MeasurementStep } from "./steps/MeasurementStep";
import { WeightStep } from "./steps/WeightStep";
import { HeightStep } from "./steps/HeightStep";
import { ActivityStep } from "./steps/ActivityStep";
import { UsernameStep } from "./steps/UsernameStep";
import { SummaryStep } from "./steps/SummaryStep";
import { SetupData } from "./SetupContext";


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
            return (
                <BirthdateStep
                    birthdateDay={data.birthdateDay}
                    birthdateMonth={data.birthdateMonth}
                    birthdateYear={data.birthdateYear}
                    onChange={onChange}
                />
            );
        case "measurement":
            return (
                <MeasurementStep
                    measurement={data.measurement}
                    onChange={onChange}
                />
            );
        case "weight":
            return (
                <WeightStep
                    weight={data.weight}
                    weightUnit={data.weightUnit}
                    onChange={onChange}
                />
            );
        case "height":
            return (
                <HeightStep
                    height={data.height}
                    heightUnit={data.heightUnit}
                    onChange={onChange}
                />
            );
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