// components/WeekHeaderContent.tsx
"use client";

import { Button } from "@/components/ui/button";

interface WeekHeaderContentUIProps {
  weekDates: Date[];
  onSelectDate: (date: Date) => void;
  isToday: (date: Date) => boolean;
  isCurrentDate: (date: Date) => boolean;
  isAnimating: boolean;
}

const WeekHeaderContentUI = ({
  weekDates,
  onSelectDate,
  isToday,
  isCurrentDate,
  isAnimating,
}: WeekHeaderContentUIProps) => {
  return (
    <div
      className={`my-2 flex flex-1 justify-between px-2 ${isAnimating ? "pointer-events-none" : ""}`}
    >
      {weekDates.map((date, index) => (
        <div key={index} className="flex flex-1 justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant={isCurrentDate(date) ? "default" : "ghost"}
              className={`my-0 flex h-10 w-10 flex-col items-center justify-center gap-0 rounded-full p-0 sm:h-14 sm:w-14 ${
                isToday(date) && !isCurrentDate(date) ? "text-primary" : ""
              }`}
              onClick={() => onSelectDate(date)}
              disabled={isAnimating}
            >
              <span className="text-xs uppercase leading-tight sm:text-lg">
                {date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .charAt(0)}
              </span>
              <span
                className={`text-xs font-semibold leading-tight sm:text-xl ${
                  isToday(date)
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {date.getDate()}
              </span>
            </Button>
            <div className="h-1 w-3 bg-green-500 sm:w-6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekHeaderContentUI;
