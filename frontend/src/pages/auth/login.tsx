import { SignIn } from '@clerk/react'

const Login = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              card: {
                boxShadow: "none",
                border: "none",
              },
            },
          }}
        />
      </div>
    </>
  )
}

export default Login