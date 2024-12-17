// frontend/src/components/dashboard/monthView/MonthViewCalendar.tsx

import { format, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface MonthViewCalendarUIProps {
  currentMonth: Date;
  startDate: Date;
  days: Date[];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  onSelectDate?: (date: Date) => void;
  completionRatios: number[];
}

// Helper function to map ratio to Tailwind CSS classes
const getGreenClass = (ratio: number): string => {
  if (ratio === 0) return "bg-transparent";
  if (ratio > 0 && ratio <= 0.2) return "bg-green-100";
  if (ratio > 0.2 && ratio <= 0.4) return "bg-green-300";
  if (ratio > 0.4 && ratio <= 0.6) return "bg-green-400";
  if (ratio > 0.6 && ratio <= 0.8) return "bg-green-600";
  if (ratio > 0.8) return "bg-green-800";
  return "bg-transparent"; // Fallback
};

// Helper function to map ratio to Tailwind CSS text color classes
const getTextClass = (ratio: number): string => {
  if (ratio > 0 && ratio <= 0.4) return "text-black";
  return "text-white";
};

export function MonthViewCalendarUI({
  currentMonth,
  startDate,
  days,
  goToPreviousMonth,
  goToNextMonth,
  onSelectDate,
  completionRatios,
}: MonthViewCalendarUIProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold text-primary">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button variant="outline" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={day + index} className="text-center text-lg font-medium">
            {day}
          </div>
        ))}
        {/* Empty cells for days before the start of the month */}
        {Array.from({ length: startDate.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day, index) => (
          <div
            key={day.toISOString()}
            className={clsx(
              "flex aspect-square cursor-pointer items-center justify-center rounded-md border transition-colors duration-300",
              isToday(day)
                ? "rounded-full border-2 border-primary text-primary"
                : "",
              getGreenClass(completionRatios[index]),
              getTextClass(completionRatios[index]), // Apply text color based on ratio
            )}
            onClick={() => onSelectDate && onSelectDate(day)}
            title={`Completed: ${Math.round(completionRatios[index] * 100)}%`}
            aria-label={`Completed: ${Math.round(
              completionRatios[index] * 100,
            )}%`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}
