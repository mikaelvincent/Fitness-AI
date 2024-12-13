import React, { createContext, useContext, useState } from "react";

export interface SetupData {
    gender: string;
    birthdateDay: string;
    birthdateMonth: string;
    birthdateYear: string;
    measurement: "imperial" | "metric";
    weight: number; // We'll store in a base unit, e.g. kg if metric chosen, else lbs.
    weightUnit: "kg" | "lbs";
    height: number; // Store in a base unit, e.g. cm if metric chosen, else inches.
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
        weight: 70, // default weight in kg
        weightUnit: "kg",
        height: 170, // default height in cm
        heightUnit: "cm",
        activity: "sedentary",
        nickname: "",
    });

    const updateData = (partial: Partial<SetupData>) => {
        setData((prev) => ({ ...prev, ...partial }));
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
