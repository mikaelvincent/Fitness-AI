// components/Calendar.tsx
import { ReactNode, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SwipableWeekHeader from "./calendarHeader/SwipableWeekHeader";
import WeekHeaderContent from "./calendarHeader/WeekHeaderContent.tsx";
import WeekHeaderNavigation from "./calendarHeader/WeekHeaderNavigation";
import SwipableDayView from "./exerciseSet/SwipableDayView.tsx";
import { isSameWeek } from "@/utils/dateUtils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CalendarProps {
  children: ReactNode;
  returnCurrentDate: (date: Date) => void;
}

const Calendar = ({ children, returnCurrentDate }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayTransitionDirection, setDayTransitionDirection] = useState<
    "next" | "prev" | null
  >(null);
  const [weekTransitionDirection, setWeekTransitionDirection] = useState<
    "next" | "prev" | null
  >(null);

  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  const weekStart = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0); // Normalize the time
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return start;
  }, [currentDate]);

  const selectDate = (date: Date) => {
    if (date > currentDate) {
      setDayTransitionDirection("next");
    } else if (date < currentDate) {
      setDayTransitionDirection("prev");
    } else {
      setDayTransitionDirection(null);
    }

    // Check if the selected date is in a different week
    if (!isSameWeek(currentDate, date)) {
      const direction = date > currentDate ? "next" : "prev";
      setWeekTransitionDirection(direction);
    }

    setCurrentDate(date);
    returnCurrentDate(date);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setWeekTransitionDirection(direction);
    setDayTransitionDirection(direction); // Set the day transition direction based on week navigation
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    setDayTransitionDirection(direction);
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction === "next" ? 1 : -1));

      // Check if navigating day has crossed into a different week
      if (!isSameWeek(prevDate, newDate)) {
        setWeekTransitionDirection(direction);
      }

      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const variants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? 1000 : -1000,
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? -1000 : 1000,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mx-2 flex items-center py-6 sm:mx-8">
        <h2 className="text-lg font-semibold dark:text-primary sm:text-2xl">
          {formatMonthYear(currentDate)}
        </h2>
      </div>

      <div className="rounded-lg bg-muted py-4 sm:mx-8">
        {/* Navigation Buttons with Swipeable Week Header */}
        <WeekHeaderNavigation onNavigateWeek={navigateWeek}>
          <div className="relative h-10 overflow-hidden sm:h-14">
            <AnimatePresence
              initial={false}
              custom={weekTransitionDirection}
              onExitComplete={() => setWeekTransitionDirection(null)}
            >
              <SwipableWeekHeader
                key={weekStart.getTime()}
                onNavigateWeek={navigateWeek}
                variants={variants}
                direction={weekTransitionDirection}
              >
                <WeekHeaderContent
                  weekDates={weekDates}
                  currentDate={currentDate}
                  onSelectDate={selectDate}
                />
              </SwipableWeekHeader>
            </AnimatePresence>
          </div>
        </WeekHeaderNavigation>
      </div>
      <ScrollArea className="h-full w-full">
        <div className="relative mt-4 flex-1">
          <AnimatePresence
            initial={false}
            custom={dayTransitionDirection}
            onExitComplete={() => setDayTransitionDirection(null)}
          >
            <SwipableDayView
              key={currentDate.getTime()}
              direction={dayTransitionDirection}
              onNavigateDay={navigateDay}
              variants={variants}
            >
              {children}
            </SwipableDayView>
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" className="bg-transparent" />
      </ScrollArea>
    </div>
  );
};

export default Calendar;
