import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UsernameStep = () => {
    const { data, updateData } = useSetupData();
    const [username, setUsername] = useState(data.username);
    const navigate = useNavigate();

    const handleNext = () => {
        if (!username) return;
        updateData({ username });
        navigate("/setup/summary");
    };

    return (
        <StepCard
            title="Choose a username"
            footer={<Button onClick={handleNext} disabled={!username}>Next</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="username">Enter your preferred username</Label>
                <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
        </StepCard>
    );
};

export default UsernameStep;
