import { Exercise } from "@/types/exerciseTypes.ts";

export const updateExerciseInTree = (
  exercises: Exercise[],
  updatedExercise: Exercise,
): Exercise[] => {
  return exercises.map((ex) => {
    if (ex.id === updatedExercise.id) {
      // Replace the exercise with the updated one
      return { ...updatedExercise };
    }

    if (ex.children && ex.children.length > 0) {
      // Recursively update in children
      return {
        ...ex,
        children: updateExerciseInTree(ex.children, updatedExercise),
      };
    }

    // Return the exercise as is if no match found
    return ex;
  });
};
