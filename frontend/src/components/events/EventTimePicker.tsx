import { useEffect, useRef, useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { inputClass } from "../../constant";

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 ? "30" : "00";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const formatLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};

type Props = {
  value?: string;
  onChange: (time: string) => void;
};

export const EventTimePicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && value && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-time="${value}"]`);
      activeEl?.scrollIntoView({ block: "center" });
    }
  }, [open, value]);

  return (
    <div className="relative" ref={containerRef}>
      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-stone pointer-events-none" />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputClass} pl-10 pr-9 text-left flex items-center justify-between w-full cursor-pointer`}
      >
        <span className={value ? "text-mist" : "text-fog/50"}>
          {value ? formatLabel(value) : "Select time"}
        </span>
      </button>

      <ChevronDown
        className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone pointer-events-none transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />

      {open && (
        <div
          ref={listRef}
          className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl py-1"
        >
          {TIMES.map((time) => (
            <button
              type="button"
              key={time}
              data-time={time}
              onClick={() => {
                onChange(time);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                value === time
                  ? "bg-orchid/20 text-mist font-medium"
                  : "text-fog/80 hover:bg-slate-800 hover:text-mist"
              }`}
            >
              {formatLabel(time)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};