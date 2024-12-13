// frontend/src/pages/Home.tsx

import { useEffect, useRef, useState } from "react";
import Calendar from "@/components/dashboard/Calendar";
import { Exercise, Metric } from "@/types/exerciseTypes";
import { sampleExercises } from "@/utils/exerciseListSample";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import NewExercise from "@/components/dashboard/NewExercise.tsx";
import ExerciseTree from "@/components/dashboard/exerciseSet/ExerciseTree.tsx";

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);

  const [activeParentId, setActiveParentId] = useState<number | null>(null);
  const [activeChildId, setActiveChildId] = useState<number | null>(null);

  const [newExercise, setNewExercise] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastExerciseRef = useRef<HTMLDivElement>(null);
  const prevNewExerciseRef = useRef<typeof newExercise>(null);

  useEffect(() => {
    if (!prevNewExerciseRef.current && newExercise && inputRef.current) {
      inputRef.current.focus();
    }
    prevNewExerciseRef.current = newExercise;
  }, [newExercise]);

  useEffect(() => {
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    window.history.replaceState(null, "", `?date=${formattedDate}`);
  }, [currentDate]);

  const toggleExerciseCompletion = (id: number) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise,
      ),
    );
  };

  const handleParentExpand = (id: number) => {
    setActiveParentId((prev) => (prev === id ? null : id));
    // If we switch parent or collapse the parent, reset child
    if (activeParentId !== id) {
      setActiveChildId(null);
    }
  };

  // Modify handleExpand:
  const handleChildExpand = (childId: number, parentId: number) => {
    // Ensure the parent is active first
    if (activeParentId !== parentId) {
      // If parent isn't active, activate it now (and reset child)
      setActiveParentId(parentId);
      setActiveChildId(childId);
    } else {
      // If same parent is already active, just toggle the child
      setActiveChildId((prev) => (prev === childId ? null : childId));
    }
  };

  const updateExerciseNotes = (exerciseId: number, notes: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, notes } : exercise,
      ),
    );
  };

  const addMetric = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newMetric: Metric = { name: "New Metric", value: 0, unit: "" };
          return { ...exercise, metrics: [...exercise.metrics, newMetric] };
        }
        return exercise;
      }),
    );
  };

  const updateMetric = (
    exerciseId: number,
    metricIndex: number,
    updatedMetric: Metric,
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedMetrics = [...exercise.metrics];
          updatedMetrics[metricIndex] = updatedMetric;
          return { ...exercise, metrics: updatedMetrics };
        }
        return exercise;
      }),
    );
  };

  const deleteMetric = (exerciseId: number, metricIndex: number) => {
    setExercises((prev) =>
      prev.map((exercise) => {
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

  const initiateAddExercise = () => {
    setNewExercise({ name: "", type: "" });
  };

  const handleNewExerciseNameChange = (name: string) => {
    setNewExercise((prev) => (prev ? { ...prev, name } : null));
  };

  const handleNewExerciseTypeChange = (type: string) => {
    setNewExercise((prev) => (prev ? { ...prev, type } : null));
  };

  const handleSaveNewExercise = () => {
    if (
      newExercise &&
      newExercise.name.trim() !== "" &&
      newExercise.type.trim() !== ""
    ) {
      const newId =
        exercises.length > 0 ? Math.max(...exercises.map((e) => e.id)) + 1 : 1;
      const exerciseToAdd: Exercise = {
        id: newId,
        name: newExercise.name.trim(),
        description: newExercise.type.trim(),
        completed: false,
        notes: "",
        metrics: [],
        parent_id: 0,
        date: currentDate,
      };
      setExercises([...exercises, exerciseToAdd]);
      setNewExercise(null);
    }
  };

  const handleCancelNewExercise = () => {
    setNewExercise(null);
  };

  const deleteExercise = (exerciseId: number) => {
    setExercises((prev) =>
      prev.filter((exercise) => exercise.id !== exerciseId),
    );
  };

  // Filter top-level exercises for the current date
  const topLevelExercises = exercises.filter(
    (ex) =>
      ex.parent_id === 0 &&
      ex.date.toDateString() === currentDate.toDateString(),
  );

  return (
    <div className="flex h-full w-full flex-col xl:px-24 2xl:px-32">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate}>
        {topLevelExercises.map((exercise, index) => (
          <ExerciseTree
            key={exercise.id}
            exercise={exercise}
            exercises={exercises}
            isActive={activeParentId === exercise.id} // Check if this parent is active
            onExpand={() => handleParentExpand(exercise.id)}
            onToggle={() => toggleExerciseCompletion(exercise.id)}
            toggleExerciseCompletion={toggleExerciseCompletion}
            onUpdateNotes={(notes) => updateExerciseNotes(exercise.id, notes)}
            updateExerciseNotes={updateExerciseNotes}
            onAddMetric={() => addMetric(exercise.id)}
            addMetric={addMetric}
            onUpdateMetric={(idx, updatedMetric) =>
              updateMetric(exercise.id, idx, updatedMetric)
            }
            updateMetric={updateMetric}
            onDeleteMetric={(idx) => deleteMetric(exercise.id, idx)}
            deleteMetric={deleteMetric}
            onDeleteExercise={() => deleteExercise(exercise.id)}
            deleteExercise={deleteExercise}
            activeParentId={activeParentId}
            activeChildId={activeChildId}
            onChildExpand={handleChildExpand} // Pass down a function to handle child expansion
            ref={
              index === topLevelExercises.length - 1 ? lastExerciseRef : null
            }
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
          aria-label="Add New Activity"
        >
          <Plus size={24} className="text-primary hover:text-orange-400" />
          <p className="text-primary hover:text-orange-400">Activity</p>
        </Button>
      </div>
    </div>
  );
};

export default Home;
