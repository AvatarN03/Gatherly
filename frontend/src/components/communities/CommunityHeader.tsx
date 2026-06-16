import { useAuth } from '@clerk/react'
import { Plus, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
    search: string
    onChange: (value: string) => void
}

const CommunitiesHeader = ({ search, onChange }: Props) => {

    const { userId } = useAuth();

    return (<div className="sticky top-16 z-10 bg-night/60 border-b border-stone px-2 md:px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-black tracking-widest text-fog shrink-0">Communities</h1>
            <div className="relative flex-1 lg:max-w-sm ml-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fog/50">
                    <Search className="w-4 h-4" />
                </span>
                <input
                    type="text"
                    placeholder="Search communities..."
                    value={search}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone/30 border border-lavender/30 rounded-lg text-mist placeholder-fog/50 text-sm focus:outline-none focus:border-lavender/50 min-w-50"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-fog/50 hover:text-fog hover:bg-deep-ocean/30 p-1 rounded-full transition-colors duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <button
            disabled={!userId}
                className="shrink-0 bg-orchid hover:bg-purple-700 text-mist hover:text-white text-sm px-3 py-2 rounded-xs transition-colors duration-200 flex items-center hover:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ml-auto md:ml-0"
            >
                {
                    userId ? (
                        <Link
                            to="/communities/create" >
                            <Plus className="w-4 h-4 inline-block mr-1" />
                            Create
                        </Link>

                    )
                        : (
                            <span className="text-mist text-sm">Sign in to create</span>
                        )
                }
            </button>
        </div>
    </div >
    )
}

export default CommunitiesHeader