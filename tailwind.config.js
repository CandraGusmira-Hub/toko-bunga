/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFBF9',
        blush: '#FFF0F0',
        petal: '#F9D3DB',
        peony: { DEFAULT: '#D6336C', dark: '#B02458', light: '#F06595' },
        leaf: { DEFAULT: '#1F4A3A', dark: '#163528', sage: '#CFE0D3', mist: '#EAF2EC' },
        butter: '#F3C969',
        ink: '#2B1B24',
        muted: '#6B5560',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 14px 30px -12px rgba(176, 36, 88, 0.45)',
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'none' } },
        slide: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
      },
      animation: {
        rise: 'rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        fade: 'fade 0.2s ease-out both',
        pop: 'pop 0.25s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        slide: 'slide 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
    },
  },
  plugins: [],
}
