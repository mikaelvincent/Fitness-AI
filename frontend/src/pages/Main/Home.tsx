// frontend/src/pages/Home.tsx

import Calendar from "@/components/dashboard/Calendar";
import { useState } from "react";
import { ExerciseSet } from "@/components/dashboard/exerciseSet/ExerciseSet.tsx";
import { Exercise, Set } from "@/types/exerciseTypes";
import { sampleExercises } from "@/utils/exerciseListSample";
import AddWorkoutButton from "@/components/dashboard/AddWorkoutButton.tsx";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [newExercise, setNewExercise] = useState<{
    type: "weight" | "cardio";
    name: string;
  } | null>(null);

  // Toggle completion status for any exercise
  const toggleExerciseCompletion = (id: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, isCompleted: !exercise.isCompleted }
          : exercise,
      ),
    );
  };

  // Update set for weight training exercises
  const updateExerciseSet = (
    exerciseId: number,
    setNumber: number,
    updatedSet: Set,
  ) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId && exercise.isWeightTraining) {
          return {
            ...exercise,
            sets: exercise.sets?.map((set) =>
              set.setNumber === setNumber ? updatedSet : set,
            ),
          };
        }
        return exercise;
      }),
    );
  };

  // Add a new set to a weight training exercise
  const addExerciseSet = (exerciseId: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId && exercise.isWeightTraining) {
          const nextSetNumber =
            exercise.sets && exercise.sets.length > 0
              ? Math.max(...exercise.sets.map((s) => s.setNumber)) + 1
              : 1;
          const newSet: Set = {
            setNumber: nextSetNumber,
            reps: 0, // Default reps
            weightKg: 0, // Default weight
          };
          return {
            ...exercise,
            sets: exercise.sets ? [...exercise.sets, newSet] : [newSet],
            numSets: exercise.numSets ? exercise.numSets + 1 : 1,
          };
        }
        return exercise;
      }),
    );
  };

  // Delete a set from a weight training exercise
  const deleteExerciseSet = (exerciseId: number, setNumber: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId && exercise.isWeightTraining) {
          const updatedSets = exercise.sets?.filter(
            (set) => set.setNumber !== setNumber,
          );
          // Re-number the remaining sets to maintain order
          const renumberedSets = updatedSets?.map((set, index) => ({
            ...set,
            setNumber: index + 1,
          }));
          return {
            ...exercise,
            sets: renumberedSets,
            numSets: renumberedSets?.length,
          };
        }
        return exercise;
      }),
    );
  };

  // Update notes for any exercise
  const updateExerciseNotes = (exerciseId: number, notes: string) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, notes } : exercise,
      ),
    );
  };

  // Update distance for cardio exercises
  const updateCardioDistance = (exerciseId: number, distanceKm: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        !exercise.isWeightTraining && exercise.id === exerciseId
          ? { ...exercise, distanceKm }
          : exercise,
      ),
    );
  };

  // Update time for cardio exercises
  const updateCardioTime = (exerciseId: number, timeSeconds: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        !exercise.isWeightTraining && exercise.id === exerciseId
          ? { ...exercise, timeSeconds }
          : exercise,
      ),
    );
  };

  // Handle adding a new weight training exercise (opens input)
  const initiateAddWeightTraining = () => {
    setNewExercise({ type: "weight", name: "" });
  };

  // Handle adding a new cardio exercise (opens input)
  const initiateAddCardio = () => {
    setNewExercise({ type: "cardio", name: "" });
  };

  // Handle input change for new exercise name
  const handleNewExerciseNameChange = (name: string) => {
    setNewExercise((prev) => (prev ? { ...prev, name } : null));
  };

  // Save the new exercise to the list
  const handleSaveNewExercise = () => {
    if (newExercise && newExercise.name.trim() !== "") {
      const newId = exercises.length + 1; // Use UUID for unique IDs
      const exerciseToAdd: Exercise =
        newExercise.type === "weight"
          ? {
              id: Number(newId), // Adjust as per your ID handling (UUIDs are strings)
              name: newExercise.name.trim(),
              isCompleted: false,
              notes: "",
              isWeightTraining: true,
              numSets: 1,
              sets: [
                {
                  setNumber: 1,
                  reps: 10,
                  weightKg: 0,
                },
              ],
            }
          : {
              id: Number(newId), // Adjust as per your ID handling
              name: newExercise.name.trim(),
              isCompleted: false,
              notes: "",
              isWeightTraining: false,
              distanceKm: 0,
              timeSeconds: 0,
            };
      setExercises([...exercises, exerciseToAdd]);
      setNewExercise(null);
    }
  };

  // Cancel adding a new exercise
  const handleCancelNewExercise = () => {
    setNewExercise(null);
  };

  return (
    <div className="flex h-full w-full flex-col lg:px-16 xl:px-24 2xl:px-32">
      {/* **Backdrop Rendering** */}
      {isPopoverOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={() => setIsPopoverOpen(false)}
        />
      )}
      <Calendar returnCurrentDate={setCurrentDate}>
        {exercises.map((exercise) => (
          <ExerciseSet
            key={exercise.id}
            exercise={exercise} // Pass the entire exercise object
            onToggle={() => toggleExerciseCompletion(exercise.id)}
            onUpdateSet={(setNumber, updatedSet) =>
              updateExerciseSet(exercise.id, setNumber, updatedSet)
            }
            onUpdateNotes={(notes) => updateExerciseNotes(exercise.id, notes)}
            onAddSet={() => addExerciseSet(exercise.id)}
            onDeleteSet={(setNumber) =>
              deleteExerciseSet(exercise.id, setNumber)
            }
            onUpdateCardioDistance={(distanceKm) =>
              updateCardioDistance(exercise.id, distanceKm ? distanceKm : 0)
            }
            onUpdateCardioTime={(timeSeconds) =>
              updateCardioTime(exercise.id, timeSeconds ? timeSeconds : 0)
            }
          />
        ))}

        {/* Render input box for new exercise if exists */}
        {newExercise && (
          <div className="mt-4 rounded border-b-2 border-b-primary p-4">
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => handleNewExerciseNameChange(e.target.value)}
              placeholder={
                newExercise.type === "weight"
                  ? "Enter weight training exercise"
                  : "Enter cardio exercise"
              }
              className="mb-2 w-full rounded bg-zinc-700 px-2 py-1 text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSaveNewExercise}
                className="text-primary hover:text-orange-400"
                disabled={newExercise.name.trim() === ""}
                variant="ghost"
                size="sm"
              >
                <Save />
              </Button>
              <Button
                onClick={handleCancelNewExercise}
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                <X />
              </Button>
            </div>
          </div>
        )}
      </Calendar>
      <AddWorkoutButton
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        onAddWeightTraining={initiateAddWeightTraining}
        onAddCardio={initiateAddCardio}
      />
    </div>
  );
};

export default Home;
