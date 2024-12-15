// frontend/src/pages/Home.tsx

import { useEffect, useRef, useState } from "react";
import Calendar from "@/components/dashboard/Calendar";
import { Exercise } from "@/types/exerciseTypes";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { AlertCircle, BotMessageSquare, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import NewExercise from "@/components/dashboard/NewExercise.tsx";
import ExerciseTree from "@/components/dashboard/exerciseSet/ExerciseTree.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { RetrieveActivities } from "@/services/exercises/RetrieveActivities.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateOrAddActivity } from "@/services/exercises/UpdateOrAddActivity.tsx";
import { toast } from "@/hooks/use-toast.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { updateExerciseInTree } from "@/utils/updateExerciseInTree.ts";
import { convertDates } from "@/utils/convertDates.ts";
import { DeleteActivities } from "@/services/exercises/DeleteActivities.tsx";

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

  const [expandedNodes, setExpandedNodes] = useState<
    Map<number | null | undefined, number>
  >(new Map());

  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const [newExercise, setNewExercise] = useState<{
    name: string;
    type: string;
    parentId: number | null;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastExerciseRef = useRef<HTMLDivElement>(null);
  const prevNewExerciseRef = useRef<typeof newExercise>(null);
  const [noExercises, setNoExercises] = useState<boolean>(false);

  const generateTempId = () => -Date.now();

  // Separate useStatus for updating activities
  const {
    status: updateStatus,
    setLoading: setUpdateLoading,
    setDone: setUpdateDone,
    setError: setUpdateError,
  } = useStatus();

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
    setNewExercise(null);
  }, [currentDate]);

  const fetchExercises = async () => {
    setLoading();
    try {
      const response = await RetrieveActivities({
        token,
        date: currentDate,
      });

      console.log(response.data);
      if (!response?.success) {
        setError();
        setResponseMessage(
          "Error " + response.status.toString() + ": " + response?.message ||
            "Failed to retrieve activities",
        );
        return;
      }
      if (response?.success && response?.data) {
        const rawData = response.data as any[];
        if (rawData.length === 0) {
          setNoExercises(true);
          setDone();
          return;
        }

        const formattedExercises = rawData.map(convertDates);
        setExercises(formattedExercises);
        setDone();
        return;
      }
    } catch (error) {
      console.error("Error retrieving activities:", error);
      setError();
    }
  };

  const toggleExerciseCompletion = async (id: number | null | undefined) => {
    if (id === null || id === undefined) return;

    // Find the exercise to toggle
    const exercise = exercises.find((ex) => ex.id === id);
    if (!exercise) return;

    // Optimistically update the frontend state
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex,
      ),
    );

    try {
      setUpdateLoading();

      // Prepare the updated exercise data
      const updatedExercise: Exercise = {
        ...exercise,
        completed: !exercise.completed,
      };

      // Send the update to the backend
      const response = await UpdateOrAddActivity({
        token,
        activities: updatedExercise,
      });

      if (!response.success) {
        setUpdateError();
        setResponseMessage(response.message || "Failed to toggle activity");
        toast({
          variant: "destructive",
          title: "Failed to toggle activity",
          description: response.message || "Failed to toggle activity",
          duration: 500,
        });
        return;
      }

      setResponseMessage("Activity toggled successfully.");
      setUpdateDone();
      toast({
        title: "Activity toggled successfully.",
        duration: 500,
      });
    } catch (error) {
      console.error("Error toggling activity:", error);
      setUpdateError();
      setResponseMessage(
        "An unexpected error occurred while updating the activity.",
      );
      toast({
        variant: "destructive",
        title: "Failed to toggle activity",
        description:
          "An error occurred while updating the activity. Please try again.",
        duration: 500,
      });

      // Revert the optimistic update
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === id ? { ...ex, completed: exercise.completed } : ex,
        ),
      );
    }
  };

  const toggleNodeExpansion = (
    id: number,
    parentId: number | null | undefined,
  ) => {
    setExpandedNodes((prev) => {
      const newMap = new Map(prev);
      if (newMap.get(parentId) === id) {
        newMap.delete(parentId);
      } else {
        newMap.set(parentId, id);
      }
      return newMap;
    });
  };

  const initiateAddExercise = (parentId: number | null = null) => {
    // If parentId = 0, top-level exercise; otherwise a child exercise
    setNewExercise({ name: "", type: "", parentId });
  };

  const handleNewExerciseNameChange = (name: string) => {
    setNewExercise((prev) => (prev ? { ...prev, name } : null));
  };

  const handleNewExerciseDescriptionChange = (description: string) => {
    setNewExercise((prev) => (prev ? { ...prev, type: description } : null));
  };

  // Modify handleSaveNewExercise to integrate Add or UpdateActivities
  const handleSaveNewExercise = async () => {
    if (
      newExercise &&
      newExercise.name.trim() !== "" &&
      newExercise.type.trim() !== ""
    ) {
      // Generate a temporary ID
      const tempId = generateTempId();

      // Create a new exercise object with the temporary ID
      const exerciseToAdd: Exercise = {
        id: tempId, // Temporary ID
        name: newExercise.name.trim(),
        description: newExercise.type.trim(),
        completed: false,
        notes: "",
        metrics: [],
        parent_id: newExercise.parentId, // Parent node
        date: currentDate, // Current date
        children: [], // Initialize children if necessary
        position: exercises.length, // Position in the list
      };

      // Optimistically update the frontend state
      setExercises((prev) => [...prev, exerciseToAdd]);

      // Clear the new exercise form
      setNewExercise(null);

      try {
        // Set loading state for updating activities
        setUpdateLoading();

        // Call the UpdateOrAddActivity service
        const response = await UpdateOrAddActivity({
          token,
          activities: {
            ...exerciseToAdd,
            id: null, // Backend will assign the actual ID
          },
        });

        if (!response.success) {
          setUpdateError();
          setResponseMessage(response.message || "Failed to add activity");
          toast({
            variant: "destructive",
            title: "Failed to add activity",
            description: response.message || "Failed to add activity",
            duration: 500,
          });
          return;
        }

        if (response.success && response.data) {
          const rawDataSavedExercise = response.data as Exercise;
          const formattedSavedExercise = convertDates(rawDataSavedExercise);
          console.log("Saved exercise:", formattedSavedExercise);
          setExercises((prev) =>
            prev.map((ex) =>
              ex.position === formattedSavedExercise.position
                ? formattedSavedExercise
                : ex,
            ),
          );

          setNoExercises(false);
          setUpdateDone();
          setResponseMessage("Activity added successfully.");
          toast({
            title: "Activity added successfully.",
            duration: 500,
          });
        }
      } catch (error) {
        console.error("Error adding activity:", error);
        setUpdateError();
        setResponseMessage(
          "An unexpected error occurred while adding the activity.",
        );
        toast({
          variant: "destructive",
          title: "Failed to add activity",
          description:
            "An error occurred while adding the activity. Please try again.",
          duration: 500,
        });

        // Revert the optimistic update by removing the temporary exercise
        setExercises((prev) => prev.filter((ex) => ex.id !== tempId));
      }
    }
  };

  const handleCancelNewExercise = () => {
    setNewExercise(null);
  };

  const deleteExercise = async (exerciseId: number | null | undefined) => {
    try {
      // Optimistically update the frontend state
      setExercises((prev) =>
        prev.filter((exercise) => exercise.id !== exerciseId),
      );

      if (exercises.length === 1) {
        setNoExercises(true);
      }

      // Send the delete request to the server
      const response = await DeleteActivities({
        token,
        id: exerciseId,
      });

      if (!response.success) {
        setResponseMessage(response.message || "Failed to delete activity");
        toast({
          variant: "destructive",
          title: "Failed to delete activity",
          description: response.message || "Failed to delete activity",
          duration: 500,
        });
        return;
      }

      // Show success message
      setResponseMessage("Activity deleted successfully.");
      toast({
        title: "Activity deleted successfully.",
        duration: 500,
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      setResponseMessage(
        "An unexpected error occurred while deleting the activity.",
      );
      toast({
        variant: "destructive",
        title: "Failed to delete activity",
        description:
          "An error occurred while deleting the activity. Please try again.",
        duration: 500,
      });

      // Revert the optimistic update
      fetchExercises().then((r) => r);
    }
  };

  const exDate = currentDate.toISOString().split("T")[0];
  const topLevelExercises = exercises.filter((ex) => {
    const exerciseDate = ex.date?.toISOString().split("T")[0];
    return ex.parent_id === null && exerciseDate === exDate;
  });

  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    try {
      // Indicate that an update is in progress
      setUpdateLoading();

      // Attempt to update the exercise on the server
      const response = await UpdateOrAddActivity({
        token,
        activities: updatedExercise,
      });

      if (!response.success) {
        // If the update failed, show an error message
        setUpdateError();
        setResponseMessage(response.message || "Failed to update activity");
        toast({
          variant: "destructive",
          title: "Failed to update activity",
          description: response.message || "Failed to update activity",
          duration: 500,
        });
        return;
      }

      // If successful, update the exercise in local state recursively
      setExercises((prev) => updateExerciseInTree(prev, updatedExercise));

      // Indicate that the update is done and show success message
      setUpdateDone();
      setResponseMessage("Activity updated successfully.");
    } catch (error) {
      console.error("Error updating activity:", error);
      setUpdateError();
      setResponseMessage(
        "An unexpected error occurred while updating the activity.",
      );
      toast({
        variant: "destructive",
        title: "Failed to update activity",
        description:
          "An error occurred while updating the activity. Please try again.",
        duration: 500,
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col xl:px-24 2xl:px-32">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate}>
        {status === "loading" && (
          <Skeleton className="h-[500px] w-[500px] rounded-xl" />
        )}
        {status === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {responseMessage || "Failed to retrieve activities"}
            </AlertDescription>
          </Alert>
        )}
        {noExercises && (
          <Card>
            <CardHeader>
              <h1 className="text-center text-2xl font-semibold">
                No activities found
              </h1>
            </CardHeader>
            <CardContent>
              <p className="text-center">No activities found for today.</p>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-2">
              <Button
                onClick={() => initiateAddExercise()}
                className="self-center"
              >
                <Plus size={24} className="mr-2" />
                Add Activity
              </Button>
              <p className="text-2xl font-semibold">OR</p>
              <Button
                variant="ghost"
                className="text-primary hover:text-orange-400"
              >
                <BotMessageSquare />
                <Link to="/chat">Chat with Genie to generate workout</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
        {/* For top-level new exercise (when parentId=0) */}
        {status === "done" &&
          topLevelExercises.map((exercise, index) => (
            <ExerciseTree
              key={exercise.id}
              exercise={exercise}
              exercises={exercises}
              expandedNodes={expandedNodes}
              onToggleExpansion={toggleNodeExpansion}
              parentId={0}
              onToggle={() => toggleExerciseCompletion(exercise.id)}
              toggleExerciseCompletion={toggleExerciseCompletion}
              onDeleteExercise={() => deleteExercise(exercise.id)}
              deleteExercise={deleteExercise}
              onAddChildExercise={() => initiateAddExercise(exercise.id)}
              addChildExercise={initiateAddExercise}
              newExercise={newExercise}
              handleNewExerciseNameChange={handleNewExerciseNameChange}
              handleNewExerciseTypeChange={handleNewExerciseDescriptionChange}
              handleSaveNewExercise={handleSaveNewExercise}
              handleCancelNewExercise={handleCancelNewExercise}
              containerRef={containerRef}
              inputRef={inputRef}
              ref={
                index === topLevelExercises.length - 1 ? lastExerciseRef : null
              }
              onUpdateExercise={handleUpdateExercise}
            />
          ))}
        {newExercise && newExercise.parentId === null && (
          <NewExercise
            name={newExercise.name}
            type={newExercise.type}
            onNameChange={handleNewExerciseNameChange}
            onTypeChange={handleNewExerciseDescriptionChange}
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
          onClick={() => initiateAddExercise()}
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
