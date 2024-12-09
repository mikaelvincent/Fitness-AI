import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { Exercise } from "@/types/exerciseTypes";
import { Input } from "@/components/ui/input.tsx";

interface CardioSectionProps {
  exercise: Exercise;
  isEditingDistance: boolean;
  isEditingTime: boolean;
  tempDistance: number | undefined;
  tempTime: number | undefined;
  onEditDistance: (editing: boolean) => void;
  onEditTime: (editing: boolean) => void;
  onTempDistanceChange: (distance: number) => void;
  onTempTimeChange: (time: number) => void;
  onDistanceSave: () => void;
  onDistanceCancel: () => void;
  onTimeSave: () => void;
  onTimeCancel: () => void;
}

export function CardioSection({
  exercise,
  isEditingDistance,
  isEditingTime,
  tempDistance,
  tempTime,
  onEditDistance,
  onEditTime,
  onTempDistanceChange,
  onTempTimeChange,
  onDistanceSave,
  onDistanceCancel,
  onTimeSave,
  onTimeCancel,
}: CardioSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Cardio Details:</h4>

      {/* Distance */}
      <div className="flex items-center justify-between">
        <span>Distance (km):</span>
        {isEditingDistance ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={tempDistance}
              onChange={(e) =>
                onTempDistanceChange(parseFloat(e.target.value) || 0)
              }
              className="w-20 rounded px-2 py-1"
              min="0"
              step="0.1"
              onFocus={(e) => e.target.select()}
            />
            <span>km</span>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDistanceSave();
              }}
              className="text-primary transition-colors hover:text-orange-400"
              aria-label="Save distance"
              size="icon"
            >
              <Save />
            </Button>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDistanceCancel();
              }}
              className="ml-2 text-red-500 transition-colors hover:text-red-700"
              aria-label="Cancel editing distance"
              size="icon"
            >
              <X />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm">{exercise.distanceKm} km</p>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEditDistance(true);
              }}
              className="text-primary transition-colors hover:text-orange-400"
              aria-label="Edit distance"
              size="icon"
            >
              <Edit />
            </Button>
          </div>
        )}
      </div>

      {/* Time */}
      <div className="flex items-center justify-between">
        <span>Time (minutes):</span>
        {isEditingTime ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={tempTime ? tempTime / 60 : 0}
              onChange={(e) =>
                onTempTimeChange((parseFloat(e.target.value) || 0) * 60)
              }
              className="w-20 rounded px-2 py-1"
              min="0"
              step="1"
              onFocus={(e) => e.target.select()}
            />
            <span>min</span>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onTimeSave();
              }}
              className="text-primary transition-colors hover:text-orange-400"
              aria-label="Save time"
              size="icon"
            >
              <Save />
            </Button>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onTimeCancel();
              }}
              className="ml-2 text-red-500 transition-colors hover:text-red-700"
              aria-label="Cancel editing time"
              size="icon"
            >
              <X />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm">
              {exercise.timeSeconds ? Math.round(exercise.timeSeconds / 60) : 0}{" "}
              min
            </p>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEditTime(true);
              }}
              className="text-primary transition-colors hover:text-orange-400"
              aria-label="Edit time"
              size="icon"
            >
              <Edit />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
