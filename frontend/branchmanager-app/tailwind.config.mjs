import baseTailwindConfig from "../../packages/config/tailwind.config.base.mjs";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	presets: [baseTailwindConfig],
};
