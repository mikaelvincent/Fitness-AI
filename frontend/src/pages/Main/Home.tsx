// frontend/src/pages/Home.tsx
import Calendar from "@/components/dashboard/Calendar.tsx";
import {useState} from "react";
import {ExerciseSet} from "@/components/dashboard/ExerciseSet.tsx";
import {Exercise, Set} from "@/types/exerciseTypes.ts";

const Home = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            id: 1,
            title: "Pull Ups",
            notes: "Use a wide grip",
            sets: [
                {number: 1, reps: 10, weight: 10},
                {number: 2, reps: 10, weight: 15},
                {number: 3, reps: 8, weight: 20},
            ],
            isCompleted: false
        },
        {
            id: 2,
            title: "Push Ups",
            notes: "1 arm",
            sets: [
                {number: 1, reps: 12, weight: 0},
                {number: 2, reps: 12, weight: 0},
                {number: 3, reps: 10, weight: 0},
            ],
            isCompleted: true
        },
        {
            id: 3,
            title: "Squats",
            notes: "",
            sets: [
                {number: 1, reps: 15, weight: 50},
                {number: 2, reps: 12, weight: 60},
                {number: 3, reps: 10, weight: 70},
            ],
            isCompleted: false
        }
    ])

    const toggleExerciseCompletion = (id: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id
                    ? {...exercise, isCompleted: !exercise.isCompleted}
                    : exercise
            )
        )
    }

    const updateExerciseSet = (exerciseId: number, setNumber: number, updatedSet: Set) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map(set =>
                            set.number === setNumber ? updatedSet : set
                        )
                    }
                    : exercise
            )
        )
    }

    const addExerciseSet = (exerciseId: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise => {
                if (exercise.id === exerciseId) {
                    const nextSetNumber = exercise.sets.length > 0 ? Math.max(...exercise.sets.map(s => s.number)) + 1 : 1
                    const newSet: Set = {
                        number: nextSetNumber,
                        reps: 0, // Default reps
                        weight: 0 // Default weight
                    }
                    return {
                        ...exercise,
                        sets: [...exercise.sets, newSet]
                    }
                }
                return exercise
            })
        )
    }

    const deleteExerciseSet = (exerciseId: number, setNumber: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise => {
                if (exercise.id === exerciseId) {
                    const updatedSets = exercise.sets.filter(set => set.number !== setNumber)
                    // Optionally, re-number the remaining sets to maintain order
                    const renumberedSets = updatedSets.map((set, index) => ({
                        ...set,
                        number: index + 1
                    }))
                    return {
                        ...exercise,
                        sets: renumberedSets
                    }
                }
                return exercise
            })
        )
    }

    return (
        <div className="flex flex-col w-full h-full space-y-8 xl:px-24 2xl:px-32 border-r-2">
            <Calendar returnCurrentDate={setCurrentDate}>
                <div className="space-y-4">
                    {exercises.map(exercise => (
                        <ExerciseSet
                            key={exercise.id}
                            title={exercise.title}
                            sets={exercise.sets}
                            isCompleted={exercise.isCompleted}
                            onToggle={() => toggleExerciseCompletion(exercise.id)}
                            onUpdateSet={(setNumber, updatedSet) => updateExerciseSet(exercise.id, setNumber, updatedSet)}
                            notes={exercise.notes}
                            onUpdateNotes={(notes) => {
                                setExercises(prevExercises =>
                                    prevExercises.map(ex =>
                                        ex.id === exercise.id
                                            ? {...ex, notes}
                                            : ex
                                    )
                                )
                            }}
                            onAddSet={() => addExerciseSet(exercise.id)}
                            onDeleteSet={(setNumber) => deleteExerciseSet(exercise.id, setNumber)}
                        />
                    ))}
                </div>
            </Calendar>
        </div>
    );
};

export default Home;
