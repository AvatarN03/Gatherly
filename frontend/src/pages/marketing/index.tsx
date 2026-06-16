import { Hero } from "../../components/marketing/Hero"
import { Features } from "../../components/marketing/Features"
import { HTW } from "../../components/marketing/HTW"
import { CTA } from "../../components/marketing/CTA"


const Marketing = () => {
  return (
    <main className="w-full">

      {/* Hero */}
      <Hero />

      {/* features */}
      <Features />

      {/* HTW */}
      <HTW />

      {/* CTA */}
      <CTA />
     
    </main>
  )
}

export default Marketing