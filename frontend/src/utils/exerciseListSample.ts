// frontend/src/utils/exerciseListSample.ts
import { Exercise } from "@/types/exerciseTypes";

// Sample list of exercises
export const sampleExercises: Exercise[] = [
  {
    id: 1,
    name: "Bench Press",
    type: "Strength",
    isCompleted: false,
    notes: "Focus on form and controlled movements.",
    metrics: [
      { name: "Sets", value: 4, unit: "count" }, // Total number of sets
      { name: "Set 1 Weight", value: 60, unit: "kg" },
      { name: "Set 1 Reps", value: 10, unit: "count" },
      { name: "Set 2 Weight", value: 65, unit: "kg" },
      { name: "Set 2 Reps", value: 8, unit: "count" },
      { name: "Set 3 Weight", value: 70, unit: "kg" },
      { name: "Set 3 Reps", value: 6, unit: "count" },
      { name: "Set 4 Weight", value: 75, unit: "kg" },
      { name: "Set 4 Reps", value: 4, unit: "count" },
    ],
  },
  {
    id: 2,
    name: "Running",
    type: "Cardio",
    isCompleted: true,
    notes: "Morning jog around the park.",
    metrics: [
      { name: "Distance", value: 5, unit: "km" },
      { name: "Time", value: 30, unit: "minutes" },
      { name: "Speed", value: 10, unit: "km/h" },
      { name: "Calories", value: 300, unit: "kcal" },
    ],
  },
  {
    id: 3,
    name: "Squats",
    type: "Strength",
    isCompleted: false,
    notes: "Keep back straight and knees aligned.",
    metrics: [
      { name: "Sets", value: 3, unit: "count" }, // Total number of sets
      { name: "Set 1 Weight", value: 80, unit: "kg" },
      { name: "Set 1 Reps", value: 12, unit: "count" },
      { name: "Set 2 Weight", value: 85, unit: "kg" },
      { name: "Set 2 Reps", value: 10, unit: "count" },
      { name: "Set 3 Weight", value: 90, unit: "kg" },
      { name: "Set 3 Reps", value: 8, unit: "count" },
    ],
  },
  {
    id: 4,
    name: "Cycling",
    type: "Cardio",
    isCompleted: true,
    notes: "Stationary bike session.",
    metrics: [
      { name: "Distance", value: 4, unit: "km" },
      { name: "Time", value: 60, unit: "minutes" },
      { name: "Speed", value: 8, unit: "km/h" },
      { name: "Calories", value: 400, unit: "kcal" },
    ],
  },
  {
    id: 5,
    name: "Deadlift",
    type: "Strength",
    isCompleted: false,
    notes: "Warm up properly before lifting heavy.",
    metrics: [
      { name: "Sets", value: 5, unit: "count" }, // Total number of sets
      { name: "Set 1 Weight", value: 100, unit: "kg" },
      { name: "Set 1 Reps", value: 5, unit: "count" },
      { name: "Set 2 Weight", value: 110, unit: "kg" },
      { name: "Set 2 Reps", value: 5, unit: "count" },
      { name: "Set 3 Weight", value: 120, unit: "kg" },
      { name: "Set 3 Reps", value: 5, unit: "count" },
      { name: "Set 4 Weight", value: 130, unit: "kg" },
      { name: "Set 4 Reps", value: 5, unit: "count" },
      { name: "Set 5 Weight", value: 140, unit: "kg" },
      { name: "Set 5 Reps", value: 3, unit: "count" },
    ],
  },
  {
    id: 6,
    name: "Swimming",
    type: "Cardio",
    isCompleted: false,
    notes: "Freestyle laps.",
    metrics: [
      { name: "Distance", value: 2, unit: "km" },
      { name: "Time", value: 20, unit: "minutes" },
      { name: "Calories", value: 250, unit: "kcal" },
    ],
  },
];
