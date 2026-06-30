import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { inputClass } from "../../constant";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function EventDatePicker({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-stone pointer-events-none" />

      <DatePicker
        selected={value ? parseISO(value) : null}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select date"
        wrapperClassName="w-full"
        popperClassName="event-datepicker-popper"
        calendarClassName="event-datepicker-calendar"
        className={`${inputClass} pl-10 cursor-pointer`}
        onChange={(date: Date | null) => {
          onChange(date ? format(date, "yyyy-MM-dd") : "");
        }}
      />
    </div>
  );
}