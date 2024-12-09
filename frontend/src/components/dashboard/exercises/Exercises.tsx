import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Exercise, Set } from "@/types/exerciseTypes";
import {
  ActionSection,
  CardioSection,
  ExerciseHeader,
  NotesSection,
  WeightTrainingSection,
} from "./ExercisesSubcomponents";
import { variants } from "@/types/interfaceVariants";

interface ExerciseProps {
  exercise: Exercise;
  onToggle: () => void;
  isExpanded: boolean;
  onExpandToggle: () => void;
  totalSets: number;
  onUpdateSet: (setNumber: number, updatedSet: Set) => void;
  onUpdateNotes: (newNotes: string) => void;
  onAddSet: () => void;
  onDeleteSet: (setNumber: number) => void;
  onUpdateCardioDistance?: (distanceKm: number | undefined) => void;
  onUpdateCardioTime?: (timeSeconds: number | undefined) => void;
  onDeleteExercise: () => void;
}

export function Exercises({
  exercise,
  onToggle,
  isExpanded,
  onExpandToggle,
  totalSets,
  onUpdateSet,
  onUpdateNotes,
  onAddSet,
  onDeleteSet,
  onUpdateCardioDistance,
  onUpdateCardioTime,
  onDeleteExercise,
}: ExerciseProps) {
  // Local states for editing
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
    if (!isExpanded) {
      // Reset editing states when collapsing
      setEditingSet(null);
      setIsEditingNotes(false);
      setIsEditingDistance(false);
      setIsEditingTime(false);
    }
  }, [isExpanded]);

  // Handlers for sets
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

  // Handlers for notes
  const handleNotesSave = () => {
    onUpdateNotes(tempNotes);
    setIsEditingNotes(false);
  };

  const handleNotesCancel = () => {
    setTempNotes(exercise.notes);
    setIsEditingNotes(false);
  };

  // Handlers for cardio
  const handleDistanceSave = () => {
    if (onUpdateCardioDistance) onUpdateCardioDistance(tempDistance);
    setIsEditingDistance(false);
  };

  const handleDistanceCancel = () => {
    setTempDistance(exercise.distanceKm);
    setIsEditingDistance(false);
  };

  const handleTimeSave = () => {
    if (onUpdateCardioTime) onUpdateCardioTime(tempTime);
    setIsEditingTime(false);
  };

  const handleTimeCancel = () => {
    setTempTime(exercise.timeSeconds);
    setIsEditingTime(false);
  };

  return (
    <div className="border-b-2 border-b-primary p-4">
      <ExerciseHeader
        exercise={exercise}
        onToggle={onToggle}
        onExpandToggle={onExpandToggle}
        isExpanded={isExpanded}
      />

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="mt-2 space-y-4"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
          >
            <div className="mt-2 space-y-4">
              <NotesSection
                exercise={exercise}
                isEditingNotes={isEditingNotes}
                tempNotes={tempNotes}
                onEditNotes={setIsEditingNotes}
                onTempNotesChange={setTempNotes}
                onSave={handleNotesSave}
                onCancel={handleNotesCancel}
              />

              {exercise.isWeightTraining ? (
                <WeightTrainingSection
                  exercise={exercise}
                  editingSet={editingSet}
                  tempReps={tempReps}
                  tempWeight={tempWeight}
                  onSetClick={handleSetClick}
                  onTempRepsChange={setTempReps}
                  onTempWeightChange={setTempWeight}
                  onSaveSet={handleSaveSet}
                  onDeleteSet={onDeleteSet}
                />
              ) : (
                <CardioSection
                  exercise={exercise}
                  isEditingDistance={isEditingDistance}
                  isEditingTime={isEditingTime}
                  tempDistance={tempDistance}
                  tempTime={tempTime}
                  onEditDistance={setIsEditingDistance}
                  onEditTime={setIsEditingTime}
                  onTempDistanceChange={setTempDistance}
                  onTempTimeChange={setTempTime}
                  onDistanceSave={handleDistanceSave}
                  onDistanceCancel={handleDistanceCancel}
                  onTimeSave={handleTimeSave}
                  onTimeCancel={handleTimeCancel}
                  totalSets={totalSets}
                />
              )}

              <ActionSection
                isWeightTraining={exercise.isWeightTraining}
                onDeleteExercise={onDeleteExercise}
                onAddSet={onAddSet}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
