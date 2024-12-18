// components/WeekHeaderNavigation.tsx

import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface WeekHeaderNavigationProps {
  onNavigateWeek: (direction: "prev" | "next") => void;
  children: ReactNode;
}

const WeekHeaderNavigation = ({
  onNavigateWeek,
  children,
}: WeekHeaderNavigationProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      {/* Previous Week Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigateWeek("prev")}
        aria-label="Previous Week"
        className="gap-0 sm:gap-2"
      >
        <ChevronLeft className="h-12 w-12" />
      </Button>

      {/* Swipeable Week Header */}
      <div className="flex-1 sm:mx-2">{children}</div>

      {/* Next Week Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigateWeek("next")}
        aria-label="Next Week"
      >
        <ChevronRight className="h-12 w-12" />
      </Button>
    </div>
  );
};

export default WeekHeaderNavigation;
