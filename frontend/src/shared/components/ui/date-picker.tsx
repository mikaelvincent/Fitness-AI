import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useState } from "react";

export function DatePicker({
  className,
  selected,
  onSelect,
}: {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(selected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            onSelect?.(newDate);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
