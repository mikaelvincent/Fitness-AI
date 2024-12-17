import React from "react";
import { SetupData } from "@/types/setupTypes";
import { GenderStep } from "./steps/GenderStep";
import { BirthdateStep } from "./steps/BirthdateStep";
import { MeasurementStep } from "./steps/MeasurementStep";
import { WeightStep } from "./steps/WeightStep";
import { HeightStep } from "./steps/HeightStep";
import { ActivityStep } from "./steps/ActivityStep";
import { NicknameStep } from "./steps/NicknameStep";
import { SummaryStep } from "./steps/SummaryStep";

interface StepContentProps {
    stepId: string;
    data: SetupData;
    onChange: (key: string, value: any) => void;
    setCurrentStep: (stepId: number) => void;
}

export const StepContent: React.FC<StepContentProps> = ({ stepId, data, onChange, setCurrentStep }) => {
    const stepsMap: Record<string, JSX.Element> = {
        gender: <GenderStep gender={data.gender} onChange={onChange} />,
        birthdate: <BirthdateStep birthdate={data.birthdate} onChange={onChange} />,
        measurement: <MeasurementStep data={data} onChange={onChange} />,
        weight: <WeightStep weight={data.weight} weightUnit={data.weightUnit} onChange={onChange} />,
        height: <HeightStep height={data.height} heightUnit={data.heightUnit} onChange={onChange} />,
        activity: <ActivityStep activity={data.activity} onChange={onChange} />,
        nickname: <NicknameStep nickname={data.nickname} onChange={onChange} />,
        summary: <SummaryStep data={data} setCurrentStep={setCurrentStep} />,
    };

    return stepsMap[stepId] || null;
};

export default StepContent;
