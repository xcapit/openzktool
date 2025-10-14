import Hero from '@/components/Hero'
import Demo from '@/components/Demo'
import Features from '@/components/Features'
import Interoperability from '@/components/Interoperability'
import UseCases from '@/components/UseCases'
import Architecture from '@/components/Architecture'
import Team from '@/components/Team'
import Roadmap from '@/components/Roadmap'
import FAQ from '@/components/FAQ'
import Community from '@/components/Community'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Demo />
      <Features />
      <Interoperability />
      <Architecture />
      <UseCases />
      <Team />
      <Roadmap />
      <FAQ />
      <Community />
      <Footer />
    </main>
  )
}
