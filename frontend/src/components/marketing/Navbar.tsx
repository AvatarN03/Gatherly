import { UserMenu } from '../custom/UserMenu'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <header className='h-16 backdrop-blur-sm bg-transparent w-full flex items-center justify-center p-2'>
            <nav className="flex items-center justify-between max-w-5xl mx-auto w-full">
                <div className="text-xl font-bold">
                    Event Prj
                </div>
                <div className="flex flex-1 items-center justify-end gap-4">
                    <ul className='space-x-4'>
                        <Link to="/communities">
                            Communities
                        </Link>
                        <Link to="/events">
                            Events
                        </Link>
                    </ul>
                    {/* dynamic component */}
                    <div className="">
                        <UserMenu />
                    </div>
                </div>
            </nav>
        </header>
    )
}
