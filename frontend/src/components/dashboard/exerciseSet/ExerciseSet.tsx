// frontend/src/components/dashboard/ExerciseSet.tsx

import {useEffect, useState} from "react";
import {ChevronDown, ChevronUp, Edit, Save, X, Plus, Check} from 'lucide-react';
import {Button} from "@/components/ui/button.tsx";
import {motion} from 'framer-motion';
import {Exercise, Set} from "@/types/exerciseTypes.ts";

interface ExerciseSetProps {
    exercise: Exercise;
    onToggle: () => void;
    onUpdateSet: (setNumber: number, updatedSet: Set) => void;
    onUpdateNotes: (newNotes: string) => void;
    onAddSet: () => void;
    onDeleteSet: (setNumber: number) => void;
    onUpdateCardioDistance?: (distanceKm: number | undefined) => void;
    onUpdateCardioTime?: (timeSeconds: number | undefined) => void;
}

export function ExerciseSet({
                                exercise,
                                onToggle,
                                onUpdateSet,
                                onUpdateNotes,
                                onAddSet,
                                onDeleteSet,
                                onUpdateCardioDistance,
                                onUpdateCardioTime,
                            }: ExerciseSetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingSet, setEditingSet] = useState<number | null>(null);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [tempNotes, setTempNotes] = useState(exercise.notes);
    const [tempReps, setTempReps] = useState<number>(0);
    const [tempWeight, setTempWeight] = useState<number>(0);
    const [tempDistance, setTempDistance] = useState<number | undefined>(exercise.isWeightTraining ? 0 : exercise.distanceKm);
    const [tempTime, setTempTime] = useState<number | undefined>(exercise.isWeightTraining ? 0 : exercise.timeSeconds);
    const [isEditingDistance, setIsEditingDistance] = useState(false);
    const [isEditingTime, setIsEditingTime] = useState(false);

    useEffect(() => {
        setTempNotes(exercise.notes);
    }, [exercise.notes]);

    useEffect(() => {
        if (!isExpanded) {
            setEditingSet(null);
            setIsEditingNotes(false);
        }
    }, [isExpanded]);

    const handleSetClick = (setNumber: number, reps: number, weightKg: number) => {
        if (editingSet === setNumber) {
            setEditingSet(null);
        } else {
            setEditingSet(setNumber);
            setTempReps(reps);
            setTempWeight(weightKg || 0);
        }
    };

    const handleSaveSet = (setNumber: number) => {
        const updatedSet: Set = {setNumber, reps: tempReps, weightKg: tempWeight};
        onUpdateSet(setNumber, updatedSet);
        setEditingSet(null);
    };

    const handleNotesSave = () => {
        onUpdateNotes(tempNotes);
        setIsEditingNotes(false);
    };

    const handleNotesCancel = () => {
        setTempNotes(exercise.notes);
        setIsEditingNotes(false);
    };

    const handleDistanceSave = () => {
        if (onUpdateCardioDistance) {
            onUpdateCardioDistance(tempDistance);
            setIsEditingDistance(false);
        }
    };

    const handleDistanceCancel = () => {
        setTempDistance(exercise.distanceKm);
        setIsEditingDistance(false);
    };

    const handleTimeSave = () => {
        if (onUpdateCardioTime) {
            onUpdateCardioTime(tempTime);
            setIsEditingTime(false);
        }
    };

    const handleTimeCancel = () => {
        setTempTime(exercise.timeSeconds);
        setIsEditingTime(false);
    };

    return (
        <div className="p-4 border-b-2 border-b-primary">
            <div className="flex items-center gap-3 mb-2" onClick={() => setIsExpanded(!isExpanded)}>
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    size="icon"
                    className={`text-primary hover:bg-primary rounded-full border-2 border-primary h-8 w-8 ${exercise.isCompleted ? "bg-primary" : ""}`}
                    aria-label={exercise.isCompleted ? "Mark exercise as incomplete" : "Mark exercise as complete"}>
                    <motion.span
                        key={exercise.isCompleted ? "completed" : "incomplete"}
                        initial={{
                            rotate: exercise.isCompleted ? 0 : 180,
                            scale: exercise.isCompleted ? 1 : 0.8,
                            opacity: exercise.isCompleted ? 1 : 0
                        }}
                        animate={{
                            rotate: exercise.isCompleted ? 0 : 180,
                            scale: exercise.isCompleted ? 1 : 0.8,
                            opacity: exercise.isCompleted ? 1 : 0
                        }}
                        transition={{type: "spring", stiffness: 300, damping: 20}}
                        className="inline-block"
                    >
                        <Check size={20} strokeWidth={3} className="text-background"/>
                    </motion.span>
                </Button>
                <h3 className="text-xl font-semibold flex-grow">{exercise.name}</h3>
                <div
                    className="text-primary hover:text-orange-400 transition-colors"
                    aria-label={isExpanded ? "Collapse exercise details" : "Expand exercise details"}
                >
                    {isExpanded ? <ChevronUp className="h-6 w-6"/> : <ChevronDown className="h-6 w-6"/>}
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2 space-y-4">
                    {/* Notes Section */}
                    <div className="flex items-center justify-between">
                        {isEditingNotes ? (
                            <div className="flex-grow mr-2">
                                <textarea
                                    value={tempNotes}
                                    onChange={(e) => setTempNotes(e.target.value)}
                                    className="w-full bg-zinc-700 rounded px-2 py-1 text-sm"
                                    placeholder="Add notes..."
                                    rows={3}
                                />
                            </div>
                        ) : (
                            <p className="text-sm">{exercise.notes}</p>
                        )}
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                isEditingNotes ? handleNotesSave() : setIsEditingNotes(true);
                            }}
                            className="text-primary hover:text-orange-400 transition-colors"
                            aria-label={isEditingNotes ? "Save notes" : "Edit notes"}
                            size="icon"
                        >
                            {isEditingNotes ? <Save/> : <Edit/>}
                        </Button>
                        {isEditingNotes && (
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotesCancel();
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                aria-label="Cancel editing notes"
                                size="icon"
                            >
                                <X/>
                            </Button>
                        )}
                    </div>

                    {/* Exercise Type Specific Sections */}
                    {exercise.isWeightTraining && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Sets:</h4>
                            {exercise.sets?.map((set) => (
                                <div
                                    key={set.setNumber}
                                    className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted rounded p-2"
                                >
                                    <span>Set {set.setNumber}</span>
                                    {editingSet === set.setNumber ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={tempReps}
                                                onChange={(e) => setTempReps(parseInt(e.target.value) || 0)}
                                                className="w-16 bg-zinc-700 rounded px-2 py-1"
                                                min="0"
                                            />
                                            <span>reps</span>
                                            <span>x</span>
                                            <input
                                                type="number"
                                                value={tempWeight}
                                                onChange={(e) => setTempWeight(parseFloat(e.target.value) || 0)}
                                                className="w-16 bg-zinc-700 rounded px-2 py-1"
                                                min="0"
                                                step="0.5"
                                            />
                                            <span>kg</span>
                                            <Button
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveSet(set.setNumber);
                                                }}
                                                className="text-primary hover:text-orange-400 transition-colors"
                                                aria-label="Save set"
                                                size="icon"
                                            >
                                                <Save/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteSet(set.setNumber);
                                                }}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                aria-label="Delete set"
                                                size="icon"
                                            >
                                                <X/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <span
                                            onClick={() => handleSetClick(set.setNumber, set.reps, set.weightKg)}>{set.reps} reps x {set.weightKg} kg</span>
                                    )}
                                </div>
                            ))}
                            <div className="w-full flex justify-end">
                                <Button
                                    variant="link"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddSet();
                                    }}
                                    className="flex items-center text-primary hover:text-orange-400 transition-colors mt-2 p-2 rounded hover:bg-muted"
                                    aria-label="Add new set"
                                >
                                    <Plus strokeWidth={2.75}/>
                                    Add Set
                                </Button>
                            </div>
                        </div>
                    )}

                    {!exercise.isWeightTraining && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Cardio Details:</h4>

                            {/* Distance */}
                            <div className="flex items-center justify-between">
                                <span>Distance (km):</span>
                                {isEditingDistance ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={tempDistance}
                                            onChange={(e) => setTempDistance(parseFloat(e.target.value) || 0)}
                                            className="w-20 bg-zinc-700 rounded px-2 py-1"
                                            min="0"
                                            step="0.1"
                                        />
                                        <span>km</span>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDistanceSave();
                                            }}
                                            className="text-primary hover:text-orange-400 transition-colors"
                                            aria-label="Save distance"
                                            size="icon"
                                        >
                                            <Save/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDistanceCancel();
                                            }}
                                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                            aria-label="Cancel editing distance"
                                            size="icon"
                                        >
                                            <X/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm">{exercise.distanceKm} km</p>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditingDistance(true);
                                            }}
                                            className="text-primary hover:text-orange-400 transition-colors"
                                            aria-label="Edit distance"
                                            size="icon"
                                        >
                                            <Edit/>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Time */}
                            <div className="flex items-center justify-between">
                                <span>Time (minutes):</span>
                                {isEditingTime ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={tempTime ? tempTime / 60 : 0} // Convert seconds to minutes for display
                                            onChange={(e) => setTempTime((parseFloat(e.target.value) || 0) * 60)}
                                            className="w-20 bg-zinc-700 rounded px-2 py-1"
                                            min="0"
                                            step="1"
                                        />
                                        <span>min</span>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTimeSave();
                                            }}
                                            className="text-primary hover:text-orange-400 transition-colors"
                                            aria-label="Save time"
                                            size="icon"
                                        >
                                            <Save/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTimeCancel();
                                            }}
                                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                            aria-label="Cancel editing time"
                                            size="icon"
                                        >
                                            <X/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm">{exercise.timeSeconds ? Math.round(exercise.timeSeconds / 60) : 0} min</p>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditingTime(true);
                                            }}
                                            className="text-primary hover:text-orange-400 transition-colors"
                                            aria-label="Edit time"
                                            size="icon"
                                        >
                                            <Edit/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
