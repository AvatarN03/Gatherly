import {
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton
} from "@clerk/react";
import { Link } from "react-router-dom";

export const Navbar = () => {

  const { isSignedIn } = useAuth();

  return (
    <header className="h-16 backdrop-blur-sm bg-transparent w-full flex items-center justify-center p-2">

      <nav className="flex items-center justify-between max-w-5xl mx-auto w-full">

        <div className="text-xl font-bold">
          Event Prj
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">

          <ul className="space-x-4">
            <Link to="/communities">
              Communities
            </Link>

            <Link to="/events">
              Events
            </Link>
          </ul>

          <div className="flex items-center justify-center gap-4">

            {
              !isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 border rounded-md">
                      Sign In
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Dashboard
                  </Link>

                  <UserButton />
                </>
              )
            }

          </div>
        </div>
      </nav>
    </header>
  );
};