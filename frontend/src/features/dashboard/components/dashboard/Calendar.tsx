// frontend/src/components/dashboard/Calendar.tsx

import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SwipableWeekHeader from "./calendarHeader/SwipableWeekHeader.tsx";
import WeekHeaderContent from "./calendarHeader/WeekHeaderContent.tsx";
import WeekHeaderNavigation from "./calendarHeader/WeekHeaderNavigation.tsx";
import SwipableView from "./exerciseSet/SwipableView.tsx";
import { isSameWeek } from "@/shared/utils/dateUtils.ts";
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CalendarProps {
  children: ReactNode;
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  rerenderWeekHeader: boolean;
  setRerenderWeekHeader: Dispatch<SetStateAction<boolean>>;
}

const Calendar = ({
  children,
  currentDate,
  setCurrentDate,
  rerenderWeekHeader,
  setRerenderWeekHeader,
}: CalendarProps) => {
  const [dayTransitionDirection, setDayTransitionDirection] = useState<
    "next" | "prev" | null
  >(null);
  const [weekTransitionDirection, setWeekTransitionDirection] = useState<
    "next" | "prev" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();

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
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setIsAnimating(true); // Start the animation
    setWeekTransitionDirection(direction);
    setDayTransitionDirection(direction); // Set the day transition direction based on week navigation
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    setIsAnimating(true); // Start the animation
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

  const handleMonthProgressView = () => {
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    navigate(`/progress?date=${formattedDate}`);
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="mx-2 flex items-center py-6 sm:mx-8">
        <Button
          variant="ghost"
          size="lg"
          onClick={handleMonthProgressView}
          className="text-2xl text-primary hover:text-orange-300"
        >
          <ChevronLeft />
          {formatMonthYear(currentDate)}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg bg-muted pb-6 pt-4 sm:mx-8 sm:pb-8 sm:pt-6">
        {/* Navigation Buttons with Swipeable Week Header */}
        <WeekHeaderNavigation onNavigateWeek={navigateWeek}>
          <div className="relative h-auto">
            <AnimatePresence
              initial={false}
              custom={weekTransitionDirection}
              onExitComplete={() => {
                setWeekTransitionDirection(null);
                setIsAnimating(false); // Animation fully completed
              }}
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
                  isAnimating={isAnimating}
                  rerender={rerenderWeekHeader}
                  setRerender={setRerenderWeekHeader}
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
            onExitComplete={() => {
              setDayTransitionDirection(null);
              setIsAnimating(false); // Day animation finished
            }}
          >
            <SwipableView
              key={currentDate.getTime()}
              direction={dayTransitionDirection}
              onNavigate={navigateDay}
              variants={variants}
            >
              {children}
            </SwipableView>
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Calendar;
