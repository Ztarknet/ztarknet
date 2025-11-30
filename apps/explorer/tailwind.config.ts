import sharedConfig from '@workspace/ui/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...sharedConfig,
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
