import type { LucideIcon } from "lucide-react";



type StatsItem = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  small?: boolean; // For smaller text on value
  watermark?: boolean; // Show watermark icon
  
};

type Props = {
  items: StatsItem[];
  className?: string;
};

const Stats = ({ items, className = '' }: Props) => {


  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl ${className}`}>
      {items.map(({ label, value, icon: Icon, small, watermark = true }) => (
        <div
          key={label}
          className={`relative flex items-center gap-3 rounded-xl border px-4 py-3.5 overflow-hidden bg-lavender/80 border-fog/20`}
        >
          {/* Watermark icon */}
          {watermark && (
            <Icon className="absolute -right-2 -bottom-2 w-14 h-14 opacity-55" />
          )}
          
          {/* Icon container */}
          <div className={`shrink-0 p-2 rounded-lg border bg-lavender text-deep-ocean`}>
            <Icon className={`w-4 h-4 text-deep-ocean`} />
          </div>
          
          {/* Value and label */}
          <div className="text-night font-semibold text-xs">
            <p className={`font-semibold ${small ? 'text-sm' : 'text-xl'}`}>
              {value}
            </p>
            <p >{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;