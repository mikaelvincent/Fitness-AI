import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { Exercise } from "@/types/exerciseTypes";

interface WeightTrainingSectionProps {
  exercise: Exercise;
  editingSet: number | null;
  tempReps: number;
  tempWeight: number;
  onSetClick: (setNumber: number, reps: number, weightKg: number) => void;
  onTempRepsChange: (reps: number) => void;
  onTempWeightChange: (weight: number) => void;
  onSaveSet: (setNumber: number) => void;
  onDeleteSet: (setNumber: number) => void;
}

export function WeightTrainingSection({
  exercise,
  editingSet,
  tempReps,
  tempWeight,
  onSetClick,
  onTempRepsChange,
  onTempWeightChange,
  onSaveSet,
  onDeleteSet,
}: WeightTrainingSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Sets:</h4>
      {exercise.sets?.map((set, index) => (
        <div
          key={set.setNumber}
          className="flex cursor-pointer items-center justify-between rounded p-2 text-sm hover:bg-muted"
        >
          <span>Set {index + 1}</span>
          {editingSet === set.setNumber ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempReps}
                onChange={(e) =>
                  onTempRepsChange(parseInt(e.target.value) || 0)
                }
                className="w-16 rounded bg-zinc-700 px-2 py-1"
                min="0"
                onFocus={(e) => e.target.select()}
              />
              <span>reps</span>
              <span>x</span>
              <input
                type="number"
                value={tempWeight}
                onChange={(e) =>
                  onTempWeightChange(parseFloat(e.target.value) || 0)
                }
                className="w-16 rounded bg-zinc-700 px-2 py-1"
                min="0"
                step="0.5"
                onFocus={(e) => e.target.select()}
              />
              <span>kg</span>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveSet(set.setNumber);
                }}
                className="text-primary transition-colors hover:text-orange-400"
                aria-label="Save set"
                size="icon"
              >
                <Save />
              </Button>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSet(set.setNumber);
                }}
                className="text-red-500 transition-colors hover:text-red-700"
                aria-label="Delete set"
                size="icon"
              >
                <Trash2 />
              </Button>
            </div>
          ) : (
            <span
              onClick={() => onSetClick(set.setNumber, set.reps, set.weightKg)}
            >
              {set.reps} reps x {set.weightKg} kg
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
