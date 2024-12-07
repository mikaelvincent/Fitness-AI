import {WeightTrainingData, CardioData, RestDayData} from "@/types/exercise/exerciseList.ts";

// Sample Weight Training Data
const weightTrainingSample: WeightTrainingData = {
    userId: 101,
    date: "2024-12-08",
    restDay: false,
    isWeightTraining: true,
    exercises: [
        {
            id: 1,
            name: "Bench Press",
            type: "weight_training",
            isWeightTraining: true,
            numSets: 4,
            sets: [
                {setNumber: 1, reps: 8, weightKg: 60},
                {setNumber: 2, reps: 8, weightKg: 60},
                {setNumber: 3, reps: 8, weightKg: 60},
                {setNumber: 4, reps: 8, weightKg: 60},
            ],
            isCompleted: true,
            notes: "Increase weight next session",
        },
        {
            id: 2,
            name: "Deadlift",
            type: "weight_training",
            isWeightTraining: true,
            numSets: 5,
            sets: [
                {setNumber: 1, reps: 5, weightKg: 100},
                {setNumber: 2, reps: 5, weightKg: 100},
                {setNumber: 3, reps: 5, weightKg: 100},
                {setNumber: 4, reps: 5, weightKg: 100},
                {setNumber: 5, reps: 5, weightKg: 100},
            ],
            isCompleted: true,
            notes: "Form was good",
        },
        {
            id: 3,
            name: "Squats",
            type: "weight_training",
            isWeightTraining: true,
            numSets: 3,
            sets: [
                {setNumber: 1, reps: 10, weightKg: 80},
                {setNumber: 2, reps: 10, weightKg: 80},
                {setNumber: 3, reps: 10, weightKg: 80},
            ],
            isCompleted: false,
            notes: "Felt heavy on the last set",
        },
    ],
};

// Sample Cardio Data
const cardioSample: CardioData = {
    userId: 101,
    date: "2024-12-09",
    restDay: false,
    isWeightTraining: false,
    isCardio: true,
    exercises: [
        {
            id: 1,
            name: "Running",
            type: "cardio",
            isCompleted: true,
            notes: "Maintained a steady pace",
            isCardio: true,
            distanceKm: 10,
            timeSeconds: 3030,
        },
        {
            id: 2,
            name: "Cycling",
            type: "cardio",
            isCompleted: false,
            notes: "Felt fatigued towards the end",
            isCardio: true,
            distanceKm: 20,
            timeSeconds: 2700,
        },
        {
            id: 3,
            name: "Jump Rope",
            type: "cardio",
            isCompleted: true,
            notes: "Improved endurance",
            isCardio: true,
            timeSeconds: 600,
            // distanceKm is optional and omitted here
        },
    ],
};

// Sample Rest Day Data
const restDaySample: RestDayData = {
    userId: 101,
    date: "2024-12-07",
    restDay: true,
    isWeightTraining: false,
    isCardio: false,
    exercises: [], // No exercises scheduled
};
