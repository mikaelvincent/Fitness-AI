// frontend/src/pages/Home.tsx

import { useEffect, useRef, useState } from "react";
import Calendar from "@/components/dashboard/Calendar";
import { Exercise, Metric } from "@/types/exerciseTypes";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { AlertCircle, Plus } from "lucide-react";
import NewExercise from "@/components/dashboard/NewExercise.tsx";
import ExerciseTree from "@/components/dashboard/exerciseSet/ExerciseTree.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { RetrieveActivities } from "@/services/exercises/RetrieveActivities.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();

  const { status, setLoading, setDone, setError } = useStatus();
  const { token } = useUser();

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [activeParentId, setActiveParentId] = useState<number | null>(null);
  const [activeChildId, setActiveChildId] = useState<number | null>(null);

  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const [newExercise, setNewExercise] = useState<{
    name: string;
    type: string;
    parentId: number;
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

    fetchExercises().then((r) => r);
  }, [currentDate]);

  const fetchExercises = async () => {
    setLoading();
    try {
      const response = await RetrieveActivities({
        token,
        date: currentDate.toString(),
      });
      if (!response?.success) {
        setError();
        setResponseMessage(
          "Error " + response.status.toString() + ": " + response?.message ||
            "Failed to retrieve activities",
        );
        return;
      }
      if (response?.success && response?.data) {
        setDone();
        setExercises(response.data as Exercise[]);
        return;
      }
    } catch (error) {
      console.error("Error retrieving activities:", error);
      setError();
    }
  };

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

  const initiateAddExercise = (parentId: number = 0) => {
    // If parentId = 0, top-level exercise; otherwise a child exercise
    setNewExercise({ name: "", type: "", parentId });
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
        parent_id: newExercise.parentId,
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

  const topLevelExercises = exercises.filter(
    (ex) =>
      ex.parent_id === 0 &&
      ex.date.toDateString() === currentDate.toDateString(),
  );

  if (status === "loading") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center xl:px-24 2xl:px-32">
        <Skeleton className="h-[500px] w-[500px] rounded-xl" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full w-full flex-col justify-center xl:px-24 2xl:px-32">
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {responseMessage || "Failed to retrieve activities"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col xl:px-24 2xl:px-32">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate}>
        {topLevelExercises.map((exercise, index) => (
          <ExerciseTree
            key={exercise.id}
            exercise={exercise}
            exercises={exercises}
            isActive={activeParentId === exercise.id}
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
            onAddChildExercise={() => initiateAddExercise(exercise.id)}
            addChildExercise={initiateAddExercise}
            activeParentId={activeParentId}
            activeChildId={activeChildId}
            onChildExpand={handleChildExpand}
            newExercise={newExercise}
            handleNewExerciseNameChange={handleNewExerciseNameChange}
            handleNewExerciseTypeChange={handleNewExerciseTypeChange}
            handleSaveNewExercise={handleSaveNewExercise}
            handleCancelNewExercise={handleCancelNewExercise}
            containerRef={containerRef}
            inputRef={inputRef}
            ref={
              index === topLevelExercises.length - 1 ? lastExerciseRef : null
            }
          />
        ))}

        {/* For top-level new exercise (when parentId=0) */}
        {newExercise && newExercise.parentId === 0 && (
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
          onClick={() => initiateAddExercise(0)}
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
