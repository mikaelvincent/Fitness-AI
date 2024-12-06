import {useEffect, useState} from "react"
import {Circle, ChevronDown, ChevronUp, Edit, Save, X, Plus} from 'lucide-react'
import {Button} from "@/components/ui/button"


interface Set {
    number: number
    reps: number
    weight: number
}

interface ExerciseSetProps {
    title: string
    sets: Set[]
    isCompleted: boolean
    notes: string
    onToggle: () => void
    onUpdateSet: (setNumber: number, updatedSet: Set) => void
    onUpdateNotes: (newNotes: string) => void
    onAddSet: () => void
    onDeleteSet: (setNumber: number) => void // New prop for deleting a set
}

export function ExerciseSet({
                                title,
                                sets,
                                isCompleted,
                                notes,
                                onToggle,
                                onUpdateSet,
                                onUpdateNotes,
                                onAddSet,
                                onDeleteSet,
                            }: ExerciseSetProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [editingSet, setEditingSet] = useState<number | null>(null)
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [tempNotes, setTempNotes] = useState(notes)
    const [tempReps, setTempReps] = useState<number>(0)
    const [tempWeight, setTempWeight] = useState<number>(0)

    useEffect(() => {
        setTempNotes(notes)
    }, [notes])

    useEffect(() => {
        if (!isExpanded) {
            setEditingSet(null)
            setIsEditingNotes(false)
        }
    }, [isExpanded])

    const handleSetClick = (setNumber: number, reps: number, weight: number) => {
        if (editingSet === setNumber) {
            setEditingSet(null)
        } else {
            setEditingSet(setNumber)
            setTempReps(reps)
            setTempWeight(weight)
        }
    }

    const handleSaveSet = (setNumber: number) => {
        const updatedSet: Set = {number: setNumber, reps: tempReps, weight: tempWeight}
        onUpdateSet(setNumber, updatedSet)
        setEditingSet(null)
    }

    const handleNotesSave = () => {
        onUpdateNotes(tempNotes)
        setIsEditingNotes(false)
    }

    const handleNotesCancel = () => {
        setTempNotes(notes)
        setIsEditingNotes(false)
    }

    return (
        <div className="p-4 rounded-lg border-b-2 border-b-primary">
            <div className="flex items-center gap-3 mb-2" onClick={() => setIsExpanded(!isExpanded)}>
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    size="default"
                    className="text-primary hover:text-orange-400 rounded-full transition-colors h-9 w-6"
                    aria-label={isCompleted ? "Mark exercise as incomplete" : "Mark exercise as complete"}
                >
                    <Circle
                        className={`h-9 w-6 ${isCompleted ? "fill-primary" : ""}`}
                    />
                </Button>
                <h3 className="text-xl font-semibold flex-grow">{title}</h3>
                <div
                    className="text-primary hover:text-orange-400 transition-colors"
                    aria-label={isExpanded ? "Collapse exercise details" : "Expand exercise details"}
                >
                    {isExpanded ? <ChevronUp className="h-6 w-6"/> : <ChevronDown className="h-6 w-6"/>}
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2 space-y-4">
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
                            <p className="text-sm">{notes}</p>
                        )}
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                isEditingNotes ? handleNotesSave() : setIsEditingNotes(true)
                            }}
                            className="text-primary hover:text-orange-400 transition-colors"
                            aria-label={isEditingNotes ? "Save notes" : "Edit notes"}
                        >
                            {isEditingNotes ? <Save className="h-5 w-5"/> : <Edit className="h-5 w-5"/>}
                        </Button>
                        {isEditingNotes && (
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotesCancel()
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                aria-label="Cancel editing notes"
                            >
                                <X className="h-5 w-5"/>
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {sets.map((set) => (
                            <div
                                key={set.number}
                                className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted p-2 rounded"
                                onClick={editingSet ? () => {
                                } : () => handleSetClick(set.number, set.reps, set.weight)}
                            >
                                <span>Set {set.number}</span>
                                {editingSet === set.number ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={tempReps} // Changed from set.reps to tempReps
                                            onChange={(e) => setTempReps(parseInt(e.target.value) || 0)}
                                            className="w-16 bg-zinc-700 rounded px-2 py-1"
                                            min="0"
                                        />
                                        <span>reps</span>
                                        <span>x</span>
                                        <input
                                            type="number"
                                            value={tempWeight} // Changed from set.weight to tempWeight
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
                                                handleSaveSet(set.number)
                                            }}
                                            className="text-primary hover:text-orange-400 transition-colors ml-2"
                                            aria-label="Save set"
                                        >
                                            <Save className="h-4 w-4"/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteSet(set.number)
                                            }}
                                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                            aria-label="Delete set"
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ) : (
                                    <span>{set.reps} reps x {set.weight} kg</span>
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
                </div>
            )}
        </div>
    )
}
