// frontend/src/pages/Home.tsx

import Calendar from "@/components/dashboard/Calendar";
import {useState} from "react";
import {ExerciseSet} from "@/components/dashboard/ExerciseSet";
import {Exercise, Set} from "@/types/exerciseTypes";
import {sampleExercises} from "@/utils/exerciseListSample";

const Home = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);

    // Toggle completion status for any exercise
    const toggleExerciseCompletion = (id: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id
                    ? {...exercise, isCompleted: !exercise.isCompleted}
                    : exercise
            )
        );
    };

    // Update set for weight training exercises
    const updateExerciseSet = (exerciseId: number, setNumber: number, updatedSet: Set) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise => {
                if (exercise.id === exerciseId && exercise.isWeightTraining) {
                    return {
                        ...exercise,
                        sets: exercise.sets?.map(set =>
                            set.setNumber === setNumber ? updatedSet : set
                        )
                    };
                }
                return exercise;
            })
        );
    };

    // Add a new set to a weight training exercise
    const addExerciseSet = (exerciseId: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise => {
                if (exercise.id === exerciseId && exercise.isWeightTraining) {
                    const nextSetNumber =
                        exercise.sets && exercise.sets.length > 0
                            ? Math.max(...exercise.sets.map(s => s.setNumber)) + 1
                            : 1;
                    const newSet: Set = {
                        setNumber: nextSetNumber,
                        reps: 0, // Default reps
                        weightKg: 0 // Default weight
                    };
                    return {
                        ...exercise,
                        sets: exercise.sets ? [...exercise.sets, newSet] : [newSet],
                        numSets: exercise.numSets ? exercise.numSets + 1 : 1
                    };
                }
                return exercise;
            })
        );
    };

    // Delete a set from a weight training exercise
    const deleteExerciseSet = (exerciseId: number, setNumber: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise => {
                if (exercise.id === exerciseId && exercise.isWeightTraining) {
                    const updatedSets = exercise.sets?.filter(set => set.setNumber !== setNumber);
                    // Re-number the remaining sets to maintain order
                    const renumberedSets = updatedSets?.map((set, index) => ({
                        ...set,
                        setNumber: index + 1
                    }));
                    return {
                        ...exercise,
                        sets: renumberedSets,
                        numSets: renumberedSets?.length
                    };
                }
                return exercise;
            })
        );
    };

    // Update notes for any exercise
    const updateExerciseNotes = (exerciseId: number, notes: string) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === exerciseId
                    ? {...exercise, notes}
                    : exercise
            )
        );
    };

    // Update distance for cardio exercises
    const updateCardioDistance = (exerciseId: number, distanceKm: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise =>
                !exercise.isWeightTraining && exercise.id === exerciseId
                    ? {...exercise, distanceKm}
                    : exercise
            )
        );
    };

    // Update time for cardio exercises
    const updateCardioTime = (exerciseId: number, timeSeconds: number) => {
        setExercises(prevExercises =>
            prevExercises.map(exercise =>
                !exercise.isWeightTraining && exercise.id === exerciseId
                    ? {...exercise, timeSeconds}
                    : exercise
            )
        );
    };

    return (
        <div className="flex flex-col w-full h-full space-y-8 xl:px-24 2xl:px-32 border-r-2">
            <Calendar returnCurrentDate={setCurrentDate}>
                <div className="space-y-4">
                    {exercises.map(exercise => (
                        <ExerciseSet
                            key={exercise.id}
                            exercise={exercise}  // Pass the entire exercise object
                            onToggle={() => toggleExerciseCompletion(exercise.id)}
                            onUpdateSet={(setNumber, updatedSet) => updateExerciseSet(exercise.id, setNumber, updatedSet)}
                            onUpdateNotes={(notes) => updateExerciseNotes(exercise.id, notes)}
                            onAddSet={() => addExerciseSet(exercise.id)}
                            onDeleteSet={(setNumber) => deleteExerciseSet(exercise.id, setNumber)}
                            onUpdateCardioDistance={(distanceKm) => updateCardioDistance(exercise.id, distanceKm ? distanceKm : 0)}
                            onUpdateCardioTime={(timeSeconds) => updateCardioTime(exercise.id, timeSeconds ? timeSeconds : 0)}
                        />
                    ))}
                </div>
            </Calendar>
        </div>
    );
};

export default Home;
