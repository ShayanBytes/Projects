/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.tsx"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: '#1E40AF',
        secondary: '#F59E0B',
        accent: '#10B981',
        light:{
          100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
        },
        dark:{
          100: '#111827',
            200: '#1F2937',
            300: '#374151',
        },
      }
    },
  },
  plugins: [],
}