import { SignUp } from '@clerk/react'

const SignUpComponent = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full">

        <SignUp routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{ elements: { boxShadow: "none" } }}
        />
      </div>
    </>
  )
}

export default SignUpComponent