import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Interoperability from '@/components/Interoperability'
import UseCases from '@/components/UseCases'
import Grant from '@/components/Grant'
import Team from '@/components/Team'
import Roadmap from '@/components/Roadmap'
import Architecture from '@/components/Architecture'
import Community from '@/components/Community'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Interoperability />
      <Architecture />
      <UseCases />
      <Grant />
      <Team />
      <Roadmap />
      <Community />
      <Footer />
    </main>
  )
}
