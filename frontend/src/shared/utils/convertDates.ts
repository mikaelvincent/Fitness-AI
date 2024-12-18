import { Exercise } from "@/shared/types/exerciseTypes";

export function convertDates(ex: any): Exercise {
  return {
    ...ex,
    date: new Date(ex.date),
    children: ex.children ? ex.children.map(convertDates) : [],
  };
}

const convertExercise = (exercise: any): Exercise => {
  return {
    ...exercise,
    date: exercise.date ? new Date(exercise.date) : null,
    created_at: exercise.created_at ? new Date(exercise.created_at) : null,
    updated_at: exercise.updated_at ? new Date(exercise.updated_at) : null,
    children: Array.isArray(exercise.children)
      ? exercise.children.map(convertExercise)
      : [],
    parent: exercise.parent ? convertExercise(exercise.parent) : null,
  };
};

export const convertDatesFromObject = (data: any): Exercise[] => {
  const exercises: Exercise[] = [];

  for (const key in data) {
    if (!isNaN(Number(key))) {
      const exercise = data[key];
      exercises.push(convertExercise(exercise));
    }
  }

  return exercises;
};
