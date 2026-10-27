import CartProvider from './context/CartProvider'
import CartDrawer from './components/CartDrawer'
import Catalog from './components/Catalog'
import CustomBouquet from './components/Custombouquet'
import Features from './components/Features'
import FloatingActions from './components/FloatingActions'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'

export default function App() {
  return (
    <CartProvider>
      <a
        href="#katalog"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-peony focus:px-5 focus:py-2.5 focus:text-white"
      >
        Langsung ke katalog
      </a>
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <CustomBouquet />
        <Features />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
    </CartProvider>
  )
}
