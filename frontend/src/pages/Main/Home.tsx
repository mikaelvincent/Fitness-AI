// frontend/src/pages/Home.tsx

import Calendar from "@/components/dashboard/Calendar";
import { useEffect, useState } from "react";
import { ExerciseSet } from "@/components/dashboard/exerciseSet/ExerciseSet";
import { Exercise, Metric } from "@/types/exerciseTypes";
import { sampleExercises } from "@/utils/exerciseListSample";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);

  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);

  // Update the URL when currentDate changes
  useEffect(() => {
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    window.history.replaceState(null, "", `?date=${formattedDate}`);
  }, [currentDate]);

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

  return (
    <div className="flex h-full w-full flex-col xl:px-24 2xl:px-32">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate}>
        {exercises.map((exercise) => (
          <ExerciseSet
            key={exercise.id}
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
          />
        ))}
      </Calendar>
    </div>
  );
};

export default Home;
