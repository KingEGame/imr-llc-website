import Cursor from './components/Cursor'
import ScrollScene from './components/ScrollScene'
import StageMonitor from './components/StageMonitor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Services from './components/Services'
import Process from './components/Process'
import Platform from './components/Platform'
import Results from './components/Results'
import Work from './components/Work'
import History from './components/History'
import Team from './components/Team'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <ScrollScene />
      <StageMonitor />
      <Cursor />
      <Nav />
      <main className="page-main">
        <Hero />
        <Services />
        <Process />
        <Platform />
        <Results />
        <Work />
        <History />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
