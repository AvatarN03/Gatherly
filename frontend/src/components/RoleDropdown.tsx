import { useState } from "react"
import { Badge } from "./Badge"
import { ChevronDown, Loader2, type LucideIcon } from "lucide-react"

type RoleOption = {
    label: string
    icon: LucideIcon
    className: string
}

export const RoleDropdown = <TRole extends string, TAssignable extends TRole>({
    currentRole,
    roleOptions,
    assignableRoles,
    canManage,
    onRoleChange,
    isPending,
}: {
    currentRole: TRole
    roleOptions: Record<TRole, RoleOption>
    assignableRoles: readonly TAssignable[]   // ← narrower than TRole, excludes OWNER
    canManage: boolean
    onRoleChange: (role: TAssignable) => void // ← matches the narrower type
    isPending: boolean
}) => {
    const [open, setOpen] = useState(false)

    if (!canManage) {
        return <Badge config={roleOptions[currentRole]} />
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full transition-colors cursor-pointer disabled:opacity-50 text-fog/80 bg-stone/10 border-stone/40 hover:border-lavender/50 hover:text-lavender disabled:cursor-not-allowed"
            >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                    <>{roleOptions[currentRole].label} <ChevronDown className="w-3.5 h-3.5" /></>
                )}
            </button>
            {open && (
                <div className="absolute right-0 top-7 z-50 bg-[#0e2030] border border-stone/40 rounded-xl shadow-2xl overflow-hidden min-w-32.5">
                    {assignableRoles.map((role) => {
                        const { label, icon: Icon, className } = roleOptions[role]
                        const isCurrent = currentRole === role
                        return (
                            <button
                                key={role}
                                onClick={() => {
                                    if (isCurrent) return          // no-op: already this role, don't fire mutation
                                    onRoleChange(role)
                                    setOpen(false)
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-stone/20 ${isCurrent ? 'opacity-40 cursor-default' : 'cursor-pointer'
                                    }`}
                            >
                                <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 rounded-full text-xs ${className}`}>
                                    <Icon className="w-3.5 h-3.5" /> {label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}