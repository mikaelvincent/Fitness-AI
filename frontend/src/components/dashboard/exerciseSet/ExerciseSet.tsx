// frontend/src/components/dashboard/ExerciseSet.tsx

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { motion } from "framer-motion";
import { Exercise, Set } from "@/types/exerciseTypes.ts";

interface ExerciseSetProps {
  exercise: Exercise;
  isActive: boolean;
  onExpand: () => void;
  onToggle: () => void;
  onUpdateSet: (setNumber: number, updatedSet: Set) => void;
  onUpdateNotes: (newNotes: string) => void;
  onAddSet: () => void;
  onDeleteSet: (setNumber: number) => void;
  onUpdateCardioDistance?: (distanceKm: number | undefined) => void;
  onUpdateCardioTime?: (timeSeconds: number | undefined) => void;
}

export function ExerciseSet({
  exercise,
  isActive,
  onToggle,
  onExpand,
  onUpdateSet,
  onUpdateNotes,
  onAddSet,
  onDeleteSet,
  onUpdateCardioDistance,
  onUpdateCardioTime,
}: ExerciseSetProps) {
  const [editingSet, setEditingSet] = useState<number | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(exercise.notes);
  const [tempReps, setTempReps] = useState<number>(0);
  const [tempWeight, setTempWeight] = useState<number>(0);
  const [tempDistance, setTempDistance] = useState<number | undefined>(
    exercise.isWeightTraining ? 0 : exercise.distanceKm,
  );
  const [tempTime, setTempTime] = useState<number | undefined>(
    exercise.isWeightTraining ? 0 : exercise.timeSeconds,
  );
  const [isEditingDistance, setIsEditingDistance] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);

  useEffect(() => {
    setTempNotes(exercise.notes);
  }, [exercise.notes]);

  useEffect(() => {
    if (!isActive) {
      setEditingSet(null);
      setIsEditingNotes(false);
      setIsEditingDistance(false);
      setIsEditingTime(false);
    }
  }, [isActive]);

  const handleSetClick = (
    setNumber: number,
    reps: number,
    weightKg: number,
  ) => {
    if (editingSet === setNumber) {
      setEditingSet(null);
    } else {
      setEditingSet(setNumber);
      setTempReps(reps);
      setTempWeight(weightKg || 0);
    }
  };

  const handleSaveSet = (setNumber: number) => {
    const updatedSet: Set = { setNumber, reps: tempReps, weightKg: tempWeight };
    onUpdateSet(setNumber, updatedSet);
    setEditingSet(null);
  };

  const handleNotesSave = () => {
    onUpdateNotes(tempNotes);
    setIsEditingNotes(false);
  };

  const handleNotesCancel = () => {
    setTempNotes(exercise.notes);
    setIsEditingNotes(false);
  };

  const handleDistanceSave = () => {
    if (onUpdateCardioDistance) {
      onUpdateCardioDistance(tempDistance);
      setIsEditingDistance(false);
    }
  };

  const handleDistanceCancel = () => {
    setTempDistance(exercise.distanceKm);
    setIsEditingDistance(false);
  };

  const handleTimeSave = () => {
    if (onUpdateCardioTime) {
      onUpdateCardioTime(tempTime);
      setIsEditingTime(false);
    }
  };

  const handleTimeCancel = () => {
    setTempTime(exercise.timeSeconds);
    setIsEditingTime(false);
  };

  return (
    <div className="border-b-2 border-b-primary p-4">
      <div className="mb-2 flex items-center gap-3" onClick={onExpand}>
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          size="icon"
          className={`h-8 w-8 rounded-full border-2 border-primary text-primary hover:bg-primary ${exercise.isCompleted ? "bg-primary" : ""}`}
          aria-label={
            exercise.isCompleted
              ? "Mark exercise as incomplete"
              : "Mark exercise as complete"
          }
        >
          <motion.span
            key={exercise.isCompleted ? "completed" : "incomplete"}
            initial={{
              rotate: exercise.isCompleted ? 0 : 180,
              scale: exercise.isCompleted ? 1 : 0.8,
              opacity: exercise.isCompleted ? 1 : 0,
            }}
            animate={{
              rotate: exercise.isCompleted ? 0 : 180,
              scale: exercise.isCompleted ? 1 : 0.8,
              opacity: exercise.isCompleted ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-block"
          >
            <Check size={20} strokeWidth={3} className="text-background" />
          </motion.span>
        </Button>
        <h3 className="flex-grow text-xl font-semibold">{exercise.name}</h3>
        <div
          className="text-primary transition-colors hover:text-orange-400"
          aria-label={
            isActive ? "Collapse exercise details" : "Expand exercise details"
          }
        >
          {isActive ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </div>
      </div>
      {isActive && (
        <div className="mt-2 space-y-4">
          {/* Notes Section */}
          <div className="flex items-center justify-between">
            {isEditingNotes ? (
              <div className="mr-2 flex-grow">
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  className="w-full rounded bg-zinc-700 px-2 py-1 text-sm"
                  placeholder="Add notes..."
                  rows={3}
                />
              </div>
            ) : (
              <p className="text-sm">{exercise.notes}</p>
            )}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                isEditingNotes ? handleNotesSave() : setIsEditingNotes(true);
              }}
              className="text-primary transition-colors hover:text-orange-400"
              aria-label={isEditingNotes ? "Save notes" : "Edit notes"}
              size="icon"
            >
              {isEditingNotes ? <Save /> : <Edit />}
            </Button>
            {isEditingNotes && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotesCancel();
                }}
                className="ml-2 text-red-500 transition-colors hover:text-red-700"
                aria-label="Cancel editing notes"
                size="icon"
              >
                <X />
              </Button>
            )}
          </div>

          {/* Exercise Type Specific Sections */}
          {exercise.isWeightTraining && (
            <div className="space-y-2">
              <h4 className="font-semibold">Sets:</h4>
              {exercise.sets?.map((set) => (
                <div
                  key={set.setNumber}
                  className="flex cursor-pointer items-center justify-between rounded p-2 text-sm hover:bg-muted"
                >
                  <span>Set {set.setNumber}</span>
                  {editingSet === set.setNumber ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempReps}
                        onChange={(e) =>
                          setTempReps(parseInt(e.target.value) || 0)
                        }
                        className="w-16 rounded bg-zinc-700 px-2 py-1"
                        min="0"
                      />
                      <span>reps</span>
                      <span>x</span>
                      <input
                        type="number"
                        value={tempWeight}
                        onChange={(e) =>
                          setTempWeight(parseFloat(e.target.value) || 0)
                        }
                        className="w-16 rounded bg-zinc-700 px-2 py-1"
                        min="0"
                        step="0.5"
                      />
                      <span>kg</span>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveSet(set.setNumber);
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
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <span
                      onClick={() =>
                        handleSetClick(set.setNumber, set.reps, set.weightKg)
                      }
                    >
                      {set.reps} reps x {set.weightKg} kg
                    </span>
                  )}
                </div>
              ))}
              <div className="flex w-full justify-end">
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSet();
                  }}
                  className="mt-2 flex items-center rounded p-2 text-primary transition-colors hover:bg-muted hover:text-orange-400"
                  aria-label="Add new set"
                >
                  <Plus strokeWidth={2.75} />
                  Add Set
                </Button>
              </div>
            </div>
          )}

          {!exercise.isWeightTraining && (
            <div className="space-y-2">
              <h4 className="font-semibold">Cardio Details:</h4>

              {/* Distance */}
              <div className="flex items-center justify-between">
                <span>Distance (km):</span>
                {isEditingDistance ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tempDistance}
                      onChange={(e) =>
                        setTempDistance(parseFloat(e.target.value) || 0)
                      }
                      className="w-20 rounded bg-zinc-700 px-2 py-1"
                      min="0"
                      step="0.1"
                    />
                    <span>km</span>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDistanceSave();
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
                        handleDistanceCancel();
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
                        setIsEditingDistance(true);
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
                    <input
                      type="number"
                      value={tempTime ? tempTime / 60 : 0} // Convert seconds to minutes for display
                      onChange={(e) =>
                        setTempTime((parseFloat(e.target.value) || 0) * 60)
                      }
                      className="w-20 rounded bg-zinc-700 px-2 py-1"
                      min="0"
                      step="1"
                    />
                    <span>min</span>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimeSave();
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
                        handleTimeCancel();
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
                      {exercise.timeSeconds
                        ? Math.round(exercise.timeSeconds / 60)
                        : 0}{" "}
                      min
                    </p>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingTime(true);
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
          )}
        </div>
      )}
    </div>
  );
}
