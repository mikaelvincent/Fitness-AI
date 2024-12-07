import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WeightStep = () => {
    const { data, updateData } = useSetupData();
    const [weight, setWeight] = useState(data.weight || "");

    const navigate = useNavigate();

    const handleNext = () => {
        if (!weight) return;
        updateData({ weight: Number(weight) });
        navigate("/setup/height");
    };

    return (
        <StepCard
            title="What is your weight?"
            footer={<Button onClick={handleNext} disabled={!weight}>Next</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="weight">Enter your weight (kg)</Label>
                <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </div>
        </StepCard>
    );
};

export default WeightStep;
