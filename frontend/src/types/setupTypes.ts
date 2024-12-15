export interface SetupData {
    gender: string;
    birthdateDay: string;
    birthdateMonth: string;
    birthdateYear: string;
    measurement: "imperial" | "metric";
    weight: number;
    weightUnit: "kg" | "lbs";
    height: number;
    heightUnit: "cm" | "in";
    activity: string;
    nickname: string;
}

export interface Step {
    id: string;
    title: string;
}
