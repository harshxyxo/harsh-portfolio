import { useEffect } from 'react'
import { ContactSection } from './components/sections/ContactSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Hero } from './components/sections/Hero'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { AskAiButton } from './components/layout/AskAiButton'
import { portfolio } from './data/portfolio'
import { startSmoothScroll } from './hooks/useSmoothScroll'
import './App.css'

function App() {
  useEffect(() => startSmoothScroll(), [])

  return (
    <div className="site-shell" id="top">
      <Header profile={portfolio} />
      <main>
        <Hero profile={portfolio} />
        <SkillsSection skills={portfolio.skills} />
        <ProjectsSection projects={portfolio.projects} />
        <ExperienceSection journey={portfolio.journey} />
        <ContactSection profile={portfolio} />
      </main>
      <Footer profile={portfolio} />
      <AskAiButton profile={portfolio} />
    </div>
  )
}

export default App
