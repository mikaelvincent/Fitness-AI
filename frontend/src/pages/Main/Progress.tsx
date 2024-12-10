// frontend/src/pages/Progress.tsx

import { MonthViewCalendar } from "@/components/dashboard/monthView/MonthViewCalendar.tsx";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

const Progress = () => {
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();

  const [currentDate, setCurrentDate] = useState(initialDate);
  const navigate = useNavigate();

  // Update currentDate if URL param changes
  // Update the URL when currentDate changes
  useEffect(() => {
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    window.history.replaceState(null, "", `?date=${formattedDate}`);
  }, [currentDate]);

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    // Navigate to the week view route, e.g., /week/yyyy-MM-dd
    const formattedDate = format(date, "yyyy-MM-dd");
    navigate(`/?date=${formattedDate}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 bg-background p-8">
      <MonthViewCalendar
        initialMonth={currentDate}
        onSelectDate={handleSelectDate}
      />

      <Card className="w-full max-w-3xl border-none">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-4xl text-green-500">7</CardTitle>
          <CardDescription className="text-lg">
            Total Workouts for the Month
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Progress;
