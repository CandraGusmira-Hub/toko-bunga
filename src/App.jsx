import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import Features from './components/Features'
// import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomBouquet from './components/Custombouquet'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <CustomBouquet />
        <Features />
        {/* <Contact /> */}
      </main>
      <Footer />
    </>
  )
}
