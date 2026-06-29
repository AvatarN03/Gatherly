import { AlertTriangle, RefreshCw } from "lucide-react"


export const Error = ({handleRetry, text}:{
    handleRetry: () => void,
    text: string
}) => {
  return (
    <div className=" bg-night/50 flex items-start justify-center py-20 md:px-4">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="p-4 bg-red-500/10 rounded-3xl flex items-center justify-between gap-3 w-full">
          <AlertTriangle className="w-64 h-64 text-red-400" />
          <div className="flex flex-col text-right gap-8">
            <p className="text-lavender text-4xl font-medium mb-1">Something went wrong</p>
            <p className="text-fog text-xl">{text}</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-slate hover:bg-slate-800 border border-purple-900 hover:border-purple-400 text-mist text-base rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-9 h-9" />
          Try again
        </button>
      </div>
    </div>
  )
}
