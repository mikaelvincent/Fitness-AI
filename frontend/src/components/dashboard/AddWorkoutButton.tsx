import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddWorkoutButtonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWeightTraining: () => void;
  onAddCardio: () => void;
}

const AddWorkoutButton = ({
  isOpen,
  onOpenChange,
  onAddWeightTraining,
  onAddCardio,
}: AddWorkoutButtonProps) => {
  return (
    <div className="flex justify-end lg:mt-6">
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-lg text-lg shadow-lg"
            size="lg"
          >
            <Plus size={24} className="text-primary hover:text-orange-400" />
            <p className="text-primary hover:text-orange-400">Workout</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-50 w-48 border-none bg-transparent"
          align="end"
        >
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => {
                onAddWeightTraining();
                onOpenChange(false);
              }}
              variant="ghost"
              className="justify-end bg-transparent"
              asChild
            >
              <div>
                <Plus
                  size={24}
                  className="text-primary hover:text-orange-400"
                />
                <p className="text-primary hover:text-orange-400">
                  Weight Training
                </p>
              </div>
            </Button>
            <Button
              onClick={() => {
                onAddCardio();
                onOpenChange(false);
              }}
              variant="ghost"
              className="justify-end bg-transparent"
              asChild
            >
              <div>
                <Plus
                  size={24}
                  className="text-primary hover:text-orange-400"
                />
                <p className="text-primary hover:text-orange-400">Cardio</p>
              </div>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddWorkoutButton;
