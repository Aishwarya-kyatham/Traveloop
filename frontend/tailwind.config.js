/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        elevated: 'var(--bg-elevated)',
        panel: 'var(--bg-panel)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        primaryStrong: 'var(--primary-strong)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 24px 70px rgba(2, 6, 23, 0.5), 0 0 60px rgba(79, 70, 229, 0.14)',
        soft: '0 10px 35px rgba(2, 6, 23, 0.24)',
      },
    },
  },
  plugins: [],
};
