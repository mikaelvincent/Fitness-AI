// frontend/src/pages/Home.tsx

import Calendar from "@/components/dashboard/Calendar";
import { useEffect, useRef, useState } from "react";
import { ExerciseSet } from "@/components/dashboard/exerciseSet/ExerciseSet";
import { Exercise, Metric } from "@/types/exerciseTypes";
import { sampleExercises } from "@/utils/exerciseListSample";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import NewExercise from "@/components/dashboard/NewExercise.tsx";

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);

  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  const [newExercise, setNewExercise] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ref to the last ExerciseSet component
  const lastExerciseRef = useRef<HTMLDivElement>(null);

  // Ref to store the previous length of exercises
  const prevExercisesLength = useRef<number>(exercises.length);

  useEffect(() => {
    if (exercises.length > prevExercisesLength.current) {
      // Scroll to the last exercise
      lastExerciseRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevExercisesLength.current = exercises.length;
  }, [exercises]);

  // Update the URL when currentDate changes
  useEffect(() => {
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    window.history.replaceState(null, "", `?date=${formattedDate}`);
  }, [currentDate]);

  useEffect(() => {
    if (newExercise && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newExercise]);

  // Toggle completion status
  const toggleExerciseCompletion = (id: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, isCompleted: !exercise.isCompleted }
          : exercise,
      ),
    );
  };

  // Handle expansion toggle
  const handleExpand = (id: number) => {
    setActiveExerciseId((prevActiveId) => (prevActiveId === id ? null : id));
  };

  // Update notes for any exercise
  const updateExerciseNotes = (exerciseId: number, notes: string) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, notes } : exercise,
      ),
    );
  };

  // Add a new metric to any exercise
  const addMetric = (exerciseId: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newMetric: Metric = {
            name: "New Metric",
            value: 0,
            unit: "",
          };
          return {
            ...exercise,
            metrics: [...exercise.metrics, newMetric],
          };
        }
        return exercise;
      }),
    );
  };

  // Update a metric for any exercise
  const updateMetric = (
    exerciseId: number,
    metricIndex: number,
    updatedMetric: Metric,
  ) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedMetrics = [...exercise.metrics];
          updatedMetrics[metricIndex] = updatedMetric;
          return { ...exercise, metrics: updatedMetrics };
        }
        return exercise;
      }),
    );
  };

  // Delete a metric from any exercise
  const deleteMetric = (exerciseId: number, metricIndex: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedMetrics = exercise.metrics.filter(
            (_, idx) => idx !== metricIndex,
          );
          return { ...exercise, metrics: updatedMetrics };
        }
        return exercise;
      }),
    );
  };

  // Handle adding a new exercise (opens input)
  const initiateAddExercise = () => {
    setNewExercise({ name: "", type: "" });
  };

  // Handle input change for new exercise name
  const handleNewExerciseNameChange = (name: string) => {
    setNewExercise((prev) => (prev ? { ...prev, name } : null));
  };

  // Handle input change for new exercise type
  const handleNewExerciseTypeChange = (type: string) => {
    setNewExercise((prev) => (prev ? { ...prev, type } : null));
  };

  // Save the new exercise to the list
  const handleSaveNewExercise = () => {
    if (
      newExercise &&
      newExercise.name.trim() !== "" &&
      newExercise.type.trim() !== ""
    ) {
      const newId =
        exercises.length > 0 ? Math.max(...exercises.map((e) => e.id)) + 1 : 1; // Ensure unique ID
      const exerciseToAdd: Exercise = {
        id: newId,
        name: newExercise.name.trim(),
        type: newExercise.type.trim(),
        isCompleted: false,
        notes: "",
        metrics: [],
      };
      setExercises([...exercises, exerciseToAdd]);
      setNewExercise(null);
    }
  };

  // Cancel adding a new exercise
  const handleCancelNewExercise = () => {
    setNewExercise(null);
  };

  // Function to delete an exercise
  const deleteExercise = (exerciseId: number) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== exerciseId),
    );
  };

  return (
    <div className="flex h-full w-full flex-col xl:px-24 2xl:px-32">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate}>
        {exercises.map((exercise, index) => (
          <ExerciseSet
            key={exercise.id}
            ref={index === exercises.length - 1 ? lastExerciseRef : null} // Assign ref to last ExerciseSet
            exercise={exercise}
            onToggle={() => toggleExerciseCompletion(exercise.id)}
            onExpand={() => handleExpand(exercise.id)}
            isActive={activeExerciseId === exercise.id}
            onUpdateNotes={(notes) => updateExerciseNotes(exercise.id, notes)}
            onAddMetric={() => addMetric(exercise.id)}
            onUpdateMetric={(idx, updatedMetric) =>
              updateMetric(exercise.id, idx, updatedMetric)
            }
            onDeleteMetric={(idx) => deleteMetric(exercise.id, idx)}
            onDeleteExercise={() => deleteExercise(exercise.id)}
          />
        ))}
        {newExercise && (
          <NewExercise
            name={newExercise.name}
            type={newExercise.type}
            onNameChange={handleNewExerciseNameChange}
            onTypeChange={handleNewExerciseTypeChange}
            onSave={handleSaveNewExercise}
            onCancel={handleCancelNewExercise}
            containerRef={containerRef}
            inputRef={inputRef}
          />
        )}
      </Calendar>
      <div className="mt-2 flex flex-none justify-end pb-1 lg:mt-4 lg:pb-6">
        <Button
          variant="ghost"
          className="rounded-lg text-lg shadow-lg"
          size="lg"
          onClick={initiateAddExercise}
          aria-label="Add New Exercise"
        >
          <Plus size={24} className="text-primary hover:text-orange-400" />
          <p className="text-primary hover:text-orange-400">Workout</p>
        </Button>
      </div>
    </div>
  );
};

export default Home;
