/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                loadingBar: {
                  '0%': { width: '0%' },
                  '100%': { width: '100%' },
                },
              },
              animation: {
                'loading-bar': 'loadingBar 0.5s linear forwards',
              },
        }
    },
    plugins: []
}
