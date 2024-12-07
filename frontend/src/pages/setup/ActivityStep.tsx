import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ActivityStep = () => {
    const { data, updateData } = useSetupData();
    const [activity, setActivity] = useState(data.activity);
    const navigate = useNavigate();

    const handleNext = () => {
        if (!activity) return;
        updateData({ activity });
        navigate("/setup/username");
    };

    return (
        <StepCard
            title="What is your level of physical activity?"
            footer={<Button onClick={handleNext} disabled={!activity}>Next</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="activity">Select your activity level</Label>
                <Select onValueChange={(val) => setActivity(val)} defaultValue={data.activity}>
                    <SelectTrigger id="activity">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">Moderately Active</SelectItem>
                        <SelectItem value="active">Very Active</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </StepCard>
    );
};

export default ActivityStep;
