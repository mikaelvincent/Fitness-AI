// src/pages/setup/SetupContext.tsx
import React, { createContext, useContext, useState } from "react";

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

interface SetupContextType {
    data: SetupData;
    updateData: (partial: Partial<SetupData>) => void;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const SetupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<SetupData>({
        gender: "",
        birthdateDay: "",
        birthdateMonth: "",
        birthdateYear: "",
        measurement: "metric",
        weight: 70,
        weightUnit: "kg",
        height: 170,
        heightUnit: "cm",
        activity: "sedentary",
        nickname: "",
    });

    const updateData = (partial: Partial<SetupData>) => {
        setData(prev => ({ ...prev, ...partial }));
    };

    return (
        <SetupContext.Provider value={{ data, updateData }}>
            {children}
        </SetupContext.Provider>
    );
};

export const useSetupData = (): SetupContextType => {
    const context = useContext(SetupContext);
    if (!context) throw new Error("useSetupData must be used within a SetupProvider");
    return context;
};
