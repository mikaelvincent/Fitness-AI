import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeightStep = () => {
    const { data, updateData } = useSetupData();
    const [height, setHeight] = useState(data.height || "");

    const navigate = useNavigate();

    const handleNext = () => {
        if (!height) return;
        updateData({ height: Number(height) });
        navigate("/setup/activity");
    };

    return (
        <StepCard
            title="What is your height?"
            footer={<Button onClick={handleNext} disabled={!height}>Next</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="height">Enter your height (cm)</Label>
                <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                />
            </div>
        </StepCard>
    );
};

export default HeightStep;
