import type { Community } from "../../types";

const OverviewTab = ({ community }: { community: Community }) => (
  <div className="rounded-xl border border-gray-200 bg-deep-ocean p-5 shadow-sm space-y-4 text-mist">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-fog/80 mb-2">Description</p>
      <p className="text-sm text-fog/80 leading-relaxed">{community.description}</p>
    </div>
    <hr className="border-stone" />
    <div className="grid grid-cols-2 gap-4 text-sm">
      {[
        { label: "Category", value: community.category },
        { label: "Location", value: community.location },
        { label: "Created", value: new Date(community.createdAt).toLocaleDateString("in-IN") },
        { label: "Created by", value: community.createdBy?.name ?? "—" },
      ].map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs text-fog/80">{label}</p>
          <p className="font-medium text-fog/80">{value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default OverviewTab;