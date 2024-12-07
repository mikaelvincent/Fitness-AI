import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BirthdateStep = () => {
    const { data, updateData } = useSetupData();
    const [birthdate, setBirthdate] = useState(data.birthdate);
    const navigate = useNavigate();

    const handleNext = () => {
        if (!birthdate) return;
        updateData({ birthdate });
        navigate("/setup/weight");
    };

    return (
        <StepCard
            title="What is your birthdate?"
            footer={<Button onClick={handleNext} disabled={!birthdate}>Next</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="birthdate">Enter your birthdate</Label>
                <Input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                />
            </div>
        </StepCard>
    );
};

export default BirthdateStep;
