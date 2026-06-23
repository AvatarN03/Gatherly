import type { LucideIcon } from "lucide-react";

type BadgeConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
};

type GenericBadgeProps = {
  config: BadgeConfig;
  size?: "sm" | "md";
};

export const Badge = ({
  config,
  size = "md",
}: GenericBadgeProps) => {
  const { label, icon: Icon, className } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full ${className} ${
        size === "sm"
          ? "text-[11px] px-2.5 py-1"
          : "text-xs px-2.5 py-1"
      }`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {label}
    </span>
  );
};