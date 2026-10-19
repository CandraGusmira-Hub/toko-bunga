import { WA_NUMBER } from '../config'

export default function Contact() {
  return (
    <section id="kontak" className="px-5 pb-16">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-rose-500 to-pink-400 rounded-[2rem] text-white text-center py-14 px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Siap mengirim bunga hari ini?</h2>
        <p className="mt-3 text-rose-50">Hubungi kami dan dapatkan rangkaian terbaik.</p>
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-7 bg-white text-rose-600 font-semibold rounded-full px-8 py-3 hover:bg-rose-50 transition"
        >
          Chat WhatsApp
        </a>
      </div>
    </section>
  )
}
