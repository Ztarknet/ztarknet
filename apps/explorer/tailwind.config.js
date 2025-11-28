import sharedConfig from '@workspace/ui/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
};
