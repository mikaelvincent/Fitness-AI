// frontend/src/components/dashboard/exerciseSet/ExerciseSet.tsx

import { forwardRef, ReactNode, useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { Exercise, Metric } from "@/types/exerciseTypes.ts";
import { Input } from "@/components/ui/input.tsx";

interface ExerciseSetProps {
  exercise: Exercise;
  isActive: boolean;
  onExpand: () => void;
  onToggle: () => void;
  onUpdateNotes: (newNotes: string) => void;
  onAddMetric: () => void;
  onUpdateMetric: (metricIndex: number, updatedMetric: Metric) => void;
  onDeleteMetric: (metricIndex: number) => void;
  onDeleteExercise: () => void;
  onAddChildExercise: () => void;
  children?: ReactNode;
}

export const ExerciseSet = forwardRef<HTMLDivElement, ExerciseSetProps>(
  (
    {
      exercise,
      isActive,
      onExpand,
      onToggle,
      onUpdateNotes,
      onAddMetric,
      onUpdateMetric,
      onDeleteMetric,
      onDeleteExercise,
      onAddChildExercise,
      children
    },
    ref
  ) => {
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [tempNotes, setTempNotes] = useState(exercise.notes);
    
    const [editingMetricIndex, setEditingMetricIndex] = useState<number | null>(
      null
    );
    const [tempMetricName, setTempMetricName] = useState("");
    const [tempMetricValue, setTempMetricValue] = useState<number>(0);
    const [tempMetricUnit, setTempMetricUnit] = useState("");
    
    useEffect(() => {
      setTempNotes(exercise.notes);
    }, [exercise.notes]);
    
    useEffect(() => {
      if (!isActive) {
        setIsEditingNotes(false);
        setEditingMetricIndex(null);
      }
    }, [isActive]);
    
    const handleNotesSave = () => {
      onUpdateNotes(tempNotes?.trim() || "");
      setIsEditingNotes(false);
    };
    
    const handleNotesCancel = () => {
      setTempNotes(exercise.notes);
      setIsEditingNotes(false);
    };
    
    const handleMetricClick = (index: number, metric: Metric) => {
      if (editingMetricIndex === index) {
        setEditingMetricIndex(null);
      } else {
        setEditingMetricIndex(index);
        setTempMetricName(metric.name);
        setTempMetricValue(metric.value);
        setTempMetricUnit(metric.unit);
      }
    };
    
    const handleSaveMetric = (index: number) => {
      const updatedMetric: Metric = {
        name: tempMetricName,
        value: tempMetricValue,
        unit: tempMetricUnit
      };
      onUpdateMetric(index, updatedMetric);
      setEditingMetricIndex(null);
    };
    
    const handleCancelMetricEdit = () => {
      setEditingMetricIndex(null);
    };
    
    const detailsVariants = {
      hidden: { opacity: 0, height: 0 },
      visible: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 }
    };
    
    return (
      <div ref={ref} className="border-b-2 border-b-primary p-4">
        <div className="mb-2 flex items-center gap-3 justify-between">
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              size="icon"
              className={`h-8 w-8 rounded-full border-2 border-secondary text-primary hover:bg-green-700 ${
                exercise.completed ? "border-green-700 bg-green-700" : ""
              }`}
              aria-label={
                exercise.completed
                  ? "Mark exercise as incomplete"
                  : "Mark exercise as complete"
              }
            >
              <motion.span
                key={exercise.completed ? "completed" : "incomplete"}
                initial={{
                  rotate: exercise.completed ? 0 : 180,
                  scale: exercise.completed ? 1 : 0.8,
                  opacity: exercise.completed ? 1 : 0
                }}
                animate={{
                  rotate: exercise.completed ? 0 : 180,
                  scale: exercise.completed ? 1 : 0.8,
                  opacity: exercise.completed ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="inline-block"
              >
                <Check size={20} strokeWidth={3} className="text-background" />
              </motion.span>
            </Button>
            <h3 className="text-xl font-semibold" onClick={onExpand}>
              {exercise.name}{" "}
              <span className="text-sm text-primary">{exercise.description}</span>
            </h3>
          </div>
          <div
            className="text-primary transition-colors hover:text-orange-400"
            aria-label={
              isActive ? "Collapse exercise details" : "Expand exercise details"
            }
            onClick={onExpand}
          >
            {isActive ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
        </div>
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="mt-2 space-y-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={detailsVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="mt-2 space-y-4">
                {/* Notes Section */}
                <div className="flex items-center justify-between">
                  {isEditingNotes ? (
                    <div className="mr-2 flex-grow">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        className="w-full rounded bg-zinc-700 px-2 py-1 text-sm"
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
                      isEditingNotes
                        ? handleNotesSave()
                        : setIsEditingNotes(true);
                    }}
                    className="text-primary transition-colors hover:text-orange-400"
                    aria-label={isEditingNotes ? "Save notes" : "Edit notes"}
                    size="icon"
                  >
                    {isEditingNotes ? <Save /> : <Edit />}
                  </Button>
                  {isEditingNotes && (
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotesCancel();
                      }}
                      className="ml-2 text-red-500 transition-colors hover:text-red-700"
                      aria-label="Cancel editing notes"
                      size="icon"
                    >
                      <X />
                    </Button>
                  )}
                </div>
                
                {/* Metrics Section */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Metrics:</h4>
                  {exercise.metrics?.map((metric, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center justify-between rounded p-2 text-sm hover:bg-muted"
                      onClick={() => handleMetricClick(index, metric)}
                    >
                      {editingMetricIndex === index ? (
                        <div
                          className="w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col">
                              <label
                                htmlFor={`metric-name-${index}`}
                                className="text-xs text-gray-300"
                              >
                                Name
                              </label>
                              <Input
                                id={`metric-name-${index}`}
                                type="text"
                                value={tempMetricName}
                                onChange={(e) =>
                                  setTempMetricName(e.target.value)
                                }
                                className="w-full rounded px-2 py-1 text-sm"
                                placeholder="Metric Name"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label
                                htmlFor={`metric-value-${index}`}
                                className="text-xs text-gray-300"
                              >
                                Value
                              </label>
                              <Input
                                id={`metric-value-${index}`}
                                type="number"
                                value={tempMetricValue}
                                onChange={(e) =>
                                  setTempMetricValue(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full rounded px-2 py-1 text-sm"
                                min="0"
                                step="0.1"
                                placeholder="Value"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label
                                htmlFor={`metric-unit-${index}`}
                                className="text-xs text-gray-300"
                              >
                                Unit
                              </label>
                              <Input
                                id={`metric-unit-${index}`}
                                type="text"
                                value={tempMetricUnit}
                                onChange={(e) =>
                                  setTempMetricUnit(e.target.value)
                                }
                                className="w-full rounded px-2 py-1 text-sm"
                                placeholder="Unit"
                              />
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveMetric(index);
                              }}
                              className="text-primary transition-colors hover:text-orange-400"
                              aria-label="Save metric"
                              size="icon"
                            >
                              <Save />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelMetricEdit();
                              }}
                              className="text-red-500 transition-colors hover:text-red-700"
                              aria-label="Cancel editing metric"
                              size="icon"
                            >
                              <X />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMetric(index);
                              }}
                              className="text-red-500 transition-colors hover:text-red-700"
                              aria-label="Delete metric"
                              size="icon"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid flex-grow grid-cols-3">
                            <p>{metric.name}: </p>
                            <p>
                              {metric.value} {metric.unit}
                            </p>
                            <p></p>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteMetric(index);
                            }}
                            className="text-red-500 transition-colors hover:text-red-700"
                            aria-label="Delete metric"
                            size="icon"
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex w-full justify-between">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteExercise();
                      }}
                      className="mt-2 flex text-red-500 items-center rounded p-2 hover:text-red-400"
                      aria-label="Delete exercise"
                    >
                      <Trash2 strokeWidth={2.75} />
                      Exercise
                    </Button>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddMetric();
                      }}
                      className="mt-2 flex items-center rounded p-2 text-primary transition-colors hover:bg-muted hover:text-orange-400"
                      aria-label="Add new metric"
                    >
                      <Plus strokeWidth={2.75} />
                      Add Metric
                    </Button>
                  </div>
                  <div className="flex w-full justify-end">
                    <Button
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddChildExercise();
                      }}
                      className="mt-2 flex items-center rounded p-2 hover:bg-muted hover:text-orange-400 self-end"
                      aria-label="Add child exercise"
                    >
                      <Plus strokeWidth={2.75} />
                      Add Exercise
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Render children (if any) under the metrics section */}
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ExerciseSet.displayName = "ExerciseSet"; // Optional: Helps with debugging
