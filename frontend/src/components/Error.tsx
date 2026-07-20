import { AlertCircle } from "lucide-react"


export const Error = ({ isRefetching, handleRetry, text }: {
  isRefetching: boolean,
  handleRetry: () => void,
  text: string
}) => {
  return (
     <div className="flex flex-col items-center gap-3 rounded-xl border border-cocoa/30 bg-cocoa/5 py-14 text-center h-[calc(100dvh-300px)] justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cocoa/15">
          <AlertCircle className="h-6 w-6 text-cocoa" strokeWidth={2} />
        </div>
        <div>
          <p className="font-medium text-mist">{text}</p>
          <p className="mt-1 text-sm text-stone">
            Something went wrong on our end. Give it another try.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleRetry()}
          disabled={isRefetching}
          className="mt-1 rounded-lg border border-slate/70 bg-orchid px-4 py-2 text-sm font-medium text-fog transition-colors hover:bg-cocoa cursor-pointer hover:text-mist disabled:opacity-60"
        >
          {isRefetching ? "Retrying..." : "Try again"}
        </button>
      </div>
  )
}
