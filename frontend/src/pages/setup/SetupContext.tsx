import React, { createContext, useContext, useState } from "react";

type SetupData = {
    gender: string;
    birthdate: string;
    weight: number | '';
    height: number | '';
    activity: string;
    username: string;
};

type SetupContextType = {
    data: SetupData;
    updateData: (partial: Partial<SetupData>) => void;
};

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const SetupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<SetupData>({
        gender: "",
        birthdate: "",
        weight: "",
        height: "",
        activity: "",
        username: "",
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

export const useSetupData = () => {
    const context = useContext(SetupContext);
    if (!context) throw new Error("useSetupData must be used within a SetupProvider");
    return context;
};
