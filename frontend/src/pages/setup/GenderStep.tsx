import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const GenderStep = () => {
    const { data, updateData } = useSetupData();
    const [gender, setGender] = useState(data.gender);
    const navigate = useNavigate();

    const handleNext = () => {
        if (!gender) return;
        updateData({ gender });
        navigate("/setup/birthdate");
    };

    return (
        <StepCard
            title="What is your gender?"
            footer={<Button onClick={handleNext} disabled={!gender}>Next</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="gender">Select your gender</Label>
                <Select onValueChange={(val) => setGender(val)} defaultValue={data.gender}>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </StepCard>
    );
};

export default GenderStep;
