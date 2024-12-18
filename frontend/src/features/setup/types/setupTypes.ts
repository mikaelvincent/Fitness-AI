export interface SetupData {
    gender: string;
    birthdate: string;
    measurement: "imperial" | "metric";
    weight: number;
    weightUnit: "kg" | "lbs";
    height: number;
    heightUnit: "cm" | "in";
    activity: string;
    nickname: string;
    [key: string]: any;
}

export interface Step {
    id: string;
    title: string;
}
