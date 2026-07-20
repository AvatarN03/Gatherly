
export const Field = ({
  label,
  error,
  children,
  classes
}: {
  label: string
  error?: string
  children: React.ReactNode
  classes?:string
}) => (
  <div className="flex flex-col gap-1.5">
    
    <label className={`text-xs uppercase tracking-widest text-stone font-medium ${classes}`}>     {label}
    </label>

    {children}

    {error && 
      <p className="text-red-400 text-xs">{error}</p>
    }

  </div>
)