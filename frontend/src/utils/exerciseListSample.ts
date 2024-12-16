// frontend/src/utils/exerciseListSample.ts
import { Exercise } from "@/types/exerciseTypes";

// Sample list of exercises
export const sampleExercises: Exercise[] = [
  {
    id: 1,
    date: new Date("2024-12-13"),
    parent_id: 0, // Top-level exercise
    name: "Upper Body Workout",
    description: "Comprehensive upper body routine.",
    notes: "Focus on compound movements.",
    completed: false,
    metrics: [
      { name: "Duration", value: 60, unit: "minutes" },
      { name: "Calories", value: 500, unit: "kcal" },
    ],
  },
  {
    id: 2,
    date: new Date("2024-12-13"),
    parent_id: 1, // Child of Upper Body Workout
    name: "Bench Press",
    description: "Chest workout.",
    notes: "Focus on form and controlled movements.",
    completed: false,
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
    id: 3,
    date: new Date("2024-12-13"),
    parent_id: 1, // Child of Upper Body Workout
    name: "Deadlift",
    description: "Back and leg workout.",
    notes: "Warm up properly before lifting heavy.",
    completed: false,
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
    id: 4,
    date: new Date("2024-12-13"),
    parent_id: 0, // Top-level exercise
    name: "Cardio Session",
    description: "Cardiovascular exercises for endurance.",
    notes: "Maintain steady pace.",
    completed: true,
    metrics: [
      { name: "Duration", value: 45, unit: "minutes" },
      { name: "Calories", value: 400, unit: "kcal" },
    ],
  },
  {
    id: 5,
    date: new Date("2024-12-13"),
    parent_id: 4, // Child of Cardio Session
    name: "Running",
    description: "Morning jog around the park.",
    notes: "Maintain a consistent speed.",
    completed: true,
    metrics: [
      { name: "Distance", value: 5, unit: "km" },
      { name: "Time", value: 30, unit: "minutes" },
      { name: "Speed", value: 10, unit: "km/h" },
      { name: "Calories", value: 300, unit: "kcal" },
    ],
  },
  {
    id: 6,
    date: new Date("2024-12-13"),
    parent_id: 4, // Child of Cardio Session
    name: "Cycling",
    description: "Stationary bike session.",
    notes: "Maintain a steady resistance.",
    completed: true,
    metrics: [
      { name: "Distance", value: 4, unit: "km" },
      { name: "Time", value: 60, unit: "minutes" },
      { name: "Speed", value: 8, unit: "km/h" },
      { name: "Calories", value: 400, unit: "kcal" },
    ],
  },
  {
    id: 7,
    date: new Date("2024-12-13"),
    parent_id: 0, // Top-level exercise
    name: "Lower Body Workout",
    description: "Comprehensive lower body routine.",
    notes: "Focus on proper form to prevent injury.",
    completed: false,
    metrics: [
      { name: "Duration", value: 50, unit: "minutes" },
      { name: "Calories", value: 450, unit: "kcal" },
    ],
  },
  {
    id: 8,
    date: new Date("2024-12-13"),
    parent_id: 7, // Child of Lower Body Workout
    name: "Squats",
    description: "Leg workout.",
    notes: "Keep back straight and knees aligned.",
    completed: false,
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
    id: 9,
    date: new Date("2024-12-13"),
    parent_id: 0, // Top-level exercise
    name: "Swimming Session",
    description: "Full-body cardio workout.",
    notes: "Focus on freestyle technique.",
    completed: false,
    metrics: [
      { name: "Duration", value: 30, unit: "minutes" },
      { name: "Calories", value: 300, unit: "kcal" },
    ],
  },
  {
    id: 10,
    date: new Date("2024-12-13"),
    parent_id: 9, // Child of Swimming Session
    name: "Swimming",
    description: "Freestyle laps.",
    notes: "Maintain a consistent pace.",
    completed: false,
    metrics: [
      { name: "Distance", value: 2, unit: "km" },
      { name: "Time", value: 20, unit: "minutes" },
      { name: "Calories", value: 250, unit: "kcal" },
    ],
  },
];
