import { AlertTriangle, RefreshCw } from "lucide-react"


export const Error = ({ handleRetry, text }: {
  handleRetry: () => void,
  text: string
}) => {
  return (
    <div className=" bg-night/50 flex items-start justify-center py-20 md:px-4 ">

        <div className="p-4 bg-red-500/10 rounded-3xl flex items-center justify-between gap-3 max-w-2xl mx-auto w-full">
          <AlertTriangle className="w-28 h-28 text-red-400" />
          <div className="flex flex-col text-right gap-8">
            <p className="text-lavender text-2xl md:text-4xl font-medium mb-1">Something went wrong</p>
            <p className="text-fog text-base md:text-xl">{text}</p>
            <button
              onClick={handleRetry}
              className="w-fit ml-auto flex items-center justify-end gap-2 px-4 py-2 bg-slate hover:bg-slate-800 border border-purple-900 hover:border-purple-400 text-mist text-base rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className="w-8 h-8" />
              Try again
            </button>
          </div>
        </div>

    </div>
  )
}
