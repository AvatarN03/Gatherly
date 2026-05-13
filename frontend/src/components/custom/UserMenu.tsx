import { useUser } from '@clerk/react'
import { Link } from 'react-router-dom';

export const UserMenu = () => {

    const { isSignedIn, isLoaded } = useUser();

    if (isLoaded && !isSignedIn) {
        return (
            <div>
                <Link to="/sign-in" className='px-4 py-2 bg-blue-500 text-white rounded-md'>
                    Sign In
                </Link>
                <Link to="/sign-up" className='px-4 py-2 bg-green-500 text-white rounded-md ml-2'>
                    Sign Up
                </Link>
            </div>
        )
    }

    return (
        <div>
            <Link to="/dashboard" className='px-4 py-2 bg-pink text-gray-800 rounded-md'>
                Dashboard
            </Link>
        </div>
    )
}
