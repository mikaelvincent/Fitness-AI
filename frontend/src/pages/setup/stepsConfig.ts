export interface Step {
    id: string;
    title: string;
}

export const steps: Step[] = [
    { id: "gender", title: "What's your gender?" },
    { id: "birthdate", title: "When's your birthdate?" },
    { id: "measurement", title: "Preferred Measurement" },
    { id: "weight", title: "What's your weight?" },
    { id: "height", title: "What's your height?" },
    { id: "activity", title: "What's your level of physical activity?" },
    { id: "nickname", title: "Set your nickname" },
    { id: "summary", title: "Review Your Information" },
];
