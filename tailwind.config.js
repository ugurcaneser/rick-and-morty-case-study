// tailwind config for nativewind

/** @type {import('tailwindcss').Config} */

module.exports = {
  // to add more components you must change content array
  content: ["components/*.{js,jsx,ts,tsx}"] ,
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}