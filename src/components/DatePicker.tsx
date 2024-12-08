import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { FC, useCallback, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Button from "./Button";
import Calendar from "./Calendar";
import Popover, { PopoverContent, PopoverTrigger } from "./Popover";

export type DatePickerProps = {
  setTimestamp: (timestamp: number | null) => void;
  label?: string;
};

const DatePicker: FC<DatePickerProps> = ({
  setTimestamp,
  label = "Pick a date",
}) => {
  const [internalDate, setInternalDate] = useState<Date>();

  const handleDateChange = useCallback(
    (newDate?: Date) => {
      setInternalDate(newDate);
      setTimestamp(newDate?.getTime() ?? null);
    },
    [setTimestamp]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-64 justify-start gap-x-2 text-left font-normal",
            !internalDate && "text-muted-foreground"
          )}>
          <FiCalendar className="size-4" />
          {internalDate ? format(internalDate, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 shadow-none">
        <Calendar selected={internalDate} onSelect={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
