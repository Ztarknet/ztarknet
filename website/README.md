# Ztarknet Website

Modern Next.js website for Ztarknet - a Starknet L2 anchored to Zcash.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Fonts**: Space Grotesk & JetBrains Mono (Google Fonts)
- **Package Manager**: Bun

## Getting Started

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
bun run build
```

### Start Production Server

```bash
bun run start
```

## Project Structure

```
website/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with fonts and metadata
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles with design tokens
│   ├── components/
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   ├── sections/        # Page sections (Hero, Thesis, etc.)
│   │   └── ui/              # Shadcn UI components
│   ├── hooks/               # React hooks (useRevealOnScroll)
│   └── lib/                 # Utilities (cn helper)
├── public/                  # Static assets
└── tailwind.config.ts       # Tailwind configuration
```

## Design System

### Colors

- **Background**: `#040405`
- **Foreground**: `#f4f4f6`
- **Muted**: `#777c8e`
- **Accent**: `#ff6b1a` (Primary orange)
- **Accent Strong**: `#ff8946`

### Typography

- **Sans Serif**: Space Grotesk (headings, body)
- **Monospace**: JetBrains Mono (code, labels)

### Key Features

- Dark theme with orange accent
- Glassmorphic card effects
- Radial gradient backgrounds
- Noise texture overlay
- Scroll-triggered reveal animations
- Sticky navigation with auto-hide on scroll

## Components

### Sections

- **Hero**: Main landing section with metrics and feature cards
- **Thesis**: Three-column cards explaining the why
- **Architecture**: Diagram of the Circle STARK rollup loop
- **Stack**: Four-card grid of the PoC stack
- **Roadmap**: Three-step impact surface
- **Resources**: Links to documentation and repositories

### Interactions

- Scroll-based reveal animations using Intersection Observer
- Sticky navigation with hide/show on scroll
- Hover effects on cards and buttons
- Smooth scrolling for anchor links

## Deployment

The site is optimized for deployment on Vercel or any other Next.js-compatible platform.

## License

[MIT](../LICENSE)


