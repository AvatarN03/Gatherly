import { useState } from 'react'
import { useCommunitiesQuery } from '../../hooks/useCommunities'
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounceValue';

const Communities = () => {
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    const {
        data: communities,
        isLoading,
        error,
    } = useCommunitiesQuery(debouncedSearch);


    if (isLoading) return <div className="p-6 text-center">Loading communities...</div>
    if (error) return <div className="p-6 text-center text-red-500">Error loading communities</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Communities</h1>
                <input
                    type="text"
                    placeholder="Search communities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 border rounded mb-6"
                />
                <Link to={"/communities/create"}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Community
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities && communities.map((community) => (
                    <Link to={`/communities/${community.id}`} key={community.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                        <div key={community.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                            <img src={community.imageUrl} alt={community.name} className="w-full h-48 object-cover rounded mb-2" />
                            <h2 className="text-xl font-semibold">{community.name}</h2>
                            <p className="text-gray-600 text-sm mb-2">{community.description}</p>
                            <p className="text-gray-500 text-xs mb-4">📍 {community.location}</p>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Communities