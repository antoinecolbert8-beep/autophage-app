console.log('--- TAILWIND CONFIG LOADED ---');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true, // Force application of styles
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                display: ['var(--font-outfit)', 'sans-serif'],
            },
            colors: {
                // Cyberpunk Palette
                cyber: {
                    black: '#0a0a0f',
                    dark: '#13131f',
                    gray: '#2a2a35',
                    blue: '#00f2ff', // Neon Cyan
                    purple: '#bc13fe', // Neon Purple
                    pink: '#ff0055', // Neon Pink
                    green: '#0aff99', // Neon Green
                    glass: 'rgba(255, 255, 255, 0.05)',
                },
            },
            boxShadow: {
                'neon-blue': '0 0 20px rgba(0, 242, 255, 0.5)',
                'neon-purple': '0 0 20px rgba(188, 19, 254, 0.5)',
                'neon-pink': '0 0 20px rgba(255, 0, 85, 0.5)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'cyber-grid': 'linear-gradient(to right, #2a2a35 1px, transparent 1px), linear-gradient(to bottom, #2a2a35 1px, transparent 1px)',
                'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #13131f 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glitch': 'glitch 1s linear infinite',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
            },
        },
    },
    plugins: [],
}
