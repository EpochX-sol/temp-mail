/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#009ef7',
                    700: '#0369a1',
                },
                dark: {
                    primary: '#1e1e2d',
                    secondary: '#2b2b40',
                    light: '#1b1b29',
                    accent: '#323248',
                },
                light: {
                    primary: '#f5f8fa',
                    secondary: '#ffffff',
                    muted: '#a1a5b7',
                },
            },
            backgroundColor: {
                'app-bg': 'var(--kt-app-bg-color)',
                'app-blank': 'var(--kt-app-blank-bg-color)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}; 