import type { Config } from "tailwindcss";
import appConfig from "./src/assets/config.json";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-color': appConfig.colorTheme.main,
        'second-color-normal': appConfig.colorTheme.second.normal,
        'second-color-dark': appConfig.colorTheme.second.dark,
        'third-color': appConfig.colorTheme.third,
    },
    },
  },
  plugins: [],
};
export default config;
