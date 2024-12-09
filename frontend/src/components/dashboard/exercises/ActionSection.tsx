import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ActionSectionProps {
  isWeightTraining: boolean;
  onDeleteExercise: () => void;
  onAddSet: () => void;
}

export function ActionSection({
  isWeightTraining,
  onDeleteExercise,
  onAddSet,
}: ActionSectionProps) {
  return (
    <div
      className={`flex w-full ${
        isWeightTraining ? "justify-between" : "justify-start"
      }`}
    >
      <Button
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteExercise();
        }}
        className="mt-2 flex items-center rounded p-2"
        aria-label="Delete exercise"
      >
        <Trash2 strokeWidth={2.75} />
        Exercise
      </Button>
      {isWeightTraining && (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onAddSet();
          }}
          className="mt-2 flex items-center rounded p-2 text-primary transition-colors hover:bg-muted hover:text-orange-400"
          aria-label="Add new set"
        >
          <Plus strokeWidth={2.75} />
          Set
        </Button>
      )}
    </div>
  );
}
