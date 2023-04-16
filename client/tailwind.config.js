/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                btn: '0px 1px 3px rgba(47, 43, 67, 0.1), inset 0px -1px 0px rgba(47, 43, 67, 0.1)',
                card: '0px 1px 2px rgba(16, 24, 40, 0.05)',
            },
        },
    },
    plugins: [],
}
