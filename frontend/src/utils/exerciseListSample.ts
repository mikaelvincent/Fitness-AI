// frontend/src/utils/exerciseListSample.ts
import {Exercise} from '../types/exerciseTypes';

// Sample list of exercises
export const sampleExercises: Exercise[] = [
    {
        id: 1,
        name: 'Bench Press',
        isCompleted: false,
        notes: 'Focus on form and controlled movements.',
        isWeightTraining: true,
        numSets: 4,
        sets: [
            {setNumber: 1, reps: 10, weightKg: 60},
            {setNumber: 2, reps: 8, weightKg: 65},
            {setNumber: 3, reps: 6, weightKg: 70},
            {setNumber: 4, reps: 4, weightKg: 75},
        ],
    },
    {
        id: 2,
        name: 'Running',
        isCompleted: true,
        notes: 'Morning jog around the park.',
        isWeightTraining: false,
        distanceKm: 5,
        timeSeconds: 1500, // 25 minutes
    },
    {
        id: 3,
        name: 'Squats',
        isCompleted: false,
        notes: 'Keep back straight and knees aligned.',
        isWeightTraining: true,
        numSets: 3,
        sets: [
            {setNumber: 1, reps: 12, weightKg: 80},
            {setNumber: 2, reps: 10, weightKg: 85},
            {setNumber: 3, reps: 8, weightKg: 90},
        ],
    },
    {
        id: 4,
        name: 'Cycling',
        isCompleted: true,
        notes: 'Stationary bike session.',
        isWeightTraining: false,
        distanceKm: 4,
        timeSeconds: 3600, // 60 minutes
    },
    {
        id: 5,
        name: 'Deadlift',
        isCompleted: false,
        notes: 'Warm up properly before lifting heavy.',
        isWeightTraining: true,
        numSets: 5,
        sets: [
            {setNumber: 1, reps: 5, weightKg: 100},
            {setNumber: 2, reps: 5, weightKg: 110},
            {setNumber: 3, reps: 5, weightKg: 120},
            {setNumber: 4, reps: 5, weightKg: 130},
            {setNumber: 5, reps: 3, weightKg: 140},
        ],
    },
    {
        id: 6,
        name: 'Swimming',
        isCompleted: false,
        notes: 'Freestyle laps.',
        isWeightTraining: false,
        distanceKm: 2,
        timeSeconds: 1200, // 20 minutes
    },
];
