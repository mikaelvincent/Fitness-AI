import { useNavigate } from "react-router-dom";
import { useSetupData } from "./SetupContext";
import { StepCard } from "../../components/setup/StepCard";
import { Button } from "@/components/ui/button";

const SummaryStep = () => {
    const { data } = useSetupData();
    const navigate = useNavigate();

    const handleFinish = () => {
        // Submit data to server or finalize setup
        console.log("User data:", data);
        navigate("/");
    };

    return (
        <StepCard
            title="Review Your Information"
            footer={<Button onClick={handleFinish}>Finish</Button>}
        >
            <div className="space-y-4">
                <p><strong>Gender:</strong> {data.gender}</p>
                <p><strong>Birthdate:</strong> {data.birthdate}</p>
                <p><strong>Weight:</strong> {data.weight} kg</p>
                <p><strong>Height:</strong> {data.height} cm</p>
                <p><strong>Activity Level:</strong> {data.activity}</p>
                <p><strong>Username:</strong> {data.username}</p>
            </div>
        </StepCard>
    );
};

export default SummaryStep;
