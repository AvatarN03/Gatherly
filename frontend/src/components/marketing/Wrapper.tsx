import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export const Wrapper = () => {
    return (
        <>
            <main className="w-full max-w-5xl mx-auto p-4  min-h-screen">
                <Navbar />
                <div className="h-full">
                    <Outlet />
                </div>
            </main>

        </>
    )
}
