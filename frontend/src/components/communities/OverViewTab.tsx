import { Tag, MapPin, CalendarDays } from "lucide-react";

import { formatDate } from "../../lib/date";

import type { Community } from "../../types";

const OverviewTab = ({ community }: { community: Community }) => {
  const meta = [
    { label: "Category", value: community.category, Icon: Tag },
    { label: "Location", value: community.location, Icon: MapPin },
    {
      label: "Created",
      value: formatDate(community.createdAt),
      Icon: CalendarDays,
    }
  ];

  return (
    <div className="rounded-xl border border-stone/50 bg-deep-ocean overflow-hidden shadow-sm text-mist">

      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fog/80 mb-2">
            Description
          </p>
          <p className="text-sm text-fog/80 leading-relaxed">
            {community.description}
          </p>
        </div>

        <hr className="border-stone/50" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {meta.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-start gap-2.5 rounded-lg border border-stone/40 bg-night/40 p-3 hover:border-orchid group"
            >
              <div className="mt-0.5 shrink-0 rounded-md bg-lavender/10 group-hover:bg-lavender/40 p-1.5">
                <Icon className="w-3.5 h-3.5 text-lavender" />
              </div>
              <div className="min-w-0 flex flex-col justify-around h-full">
                <p className="text-sm text-fog/60 group-hover:text-fog">{label}</p>
                <p className="text-sm font-medium text-fog/90 truncate bg-slate group-hover:bg-cocoa/40 p-2 px-4 rounded-full">
                  {value}
                </p>
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-stone/40 bg-night/40 p-4 flex items-center gap-3">
            <img
              src={community.createdBy?.imageUrl || "/avatar.png"}
              alt={community.createdBy?.name}
              className="w-12 h-12 rounded-full object-cover border border-stone/50"
            />

            <div className="min-w-0">
              <p className="text-[11px] text-fog/60 uppercase tracking-wide">
                Created by
              </p>
              <p className="text-sm font-semibold text-mist truncate">
                {community.createdBy?.name ?? "Unknown"}
              </p>
              <p className="text-xs text-fog truncate">
                {community.createdBy?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;