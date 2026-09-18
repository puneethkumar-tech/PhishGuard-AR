# Implementation Plan — PhishGuard-AR Phase 1: Design System + Frontend Architecture + Visual Foundation

Build the complete visual foundation and frontend architecture for **PhishGuard-AR**, an AI/ML cybersecurity platform for adversarially robust phishing and threat detection.

Phase 1 focuses exclusively on the design system, responsive application shell, 3D cyber environment (interactive globe, holographic shield, threat nodes, data stream particles), hero section, metric cards, scan preview panel with demo animation, AI model pipeline visualization, and route skeleton.

---

## User Review Required

> [!IMPORTANT]
> - **No Backend / ML Connection**: Phase 1 is strictly frontend visual architecture. All telemetry and metrics are loaded from a centralized `lib/demo-data.ts` and clearly tagged as demo placeholders.
> - **Direct in `PhishGuard-AR/frontend/`**: The Next.js project will be initialized directly inside the existing `frontend/` folder without nested directories. No changes will be made to `backend/`, `mlmodel/`, or `documents/`.

---

## Proposed Changes

### 1. Frontend Project Initialization & Dependencies
Initialize Next.js App Router project inside `c:\Users\ABISHEK K\PhishGuard-AR\frontend\` with:
- **Core**: `next@latest`, `react`, `react-dom`
- **Language & Styling**: `typescript`, `@types/react`, `@types/react-dom`, `@types/node`, `tailwindcss`, `postcss`, `autoprefixer`, `tailwind-merge`, `clsx`
- **Motion & Icons**: `framer-motion`, `lucide-react`
- **3D Graphics**: `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`

#### [NEW] [package.json](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/package.json)
#### [NEW] [tsconfig.json](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/tsconfig.json)
#### [NEW] [tailwind.config.ts](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/tailwind.config.ts)
#### [NEW] [postcss.config.mjs](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/postcss.config.mjs)
#### [NEW] [next.config.mjs](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/next.config.mjs)
#### [NEW] [.env.example](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/.env.example)

---

### 2. Design Tokens, Theming & Base Styles

Configure deep dark cybersecurity palette, glassmorphism tokens, custom gradients, and keyframes in Tailwind and CSS.

- Primary Background: `#020817`
- Surfaces: `#071426`, `#0B1B32`
- Accent Primaries: `#2563FF`, `#4D8DFF`, `#00D9FF` (Cyan), `#7C3AED` (Violet)
- Status: `#00E5A8` (Success), `#F59E0B` (Warning), `#FF3B4F` (Danger)
- Reusable glass panels with backdrop blur, subtle luminous borders (`rgba(100,150,255,0.18)`), glowing radial badges.

#### [NEW] [src/app/globals.css](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/globals.css)
#### [NEW] [src/lib/utils.ts](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/lib/utils.ts)
#### [NEW] [src/lib/constants.ts](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/lib/constants.ts)
#### [NEW] [src/lib/demo-data.ts](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/lib/demo-data.ts)
#### [NEW] [src/types/index.ts](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/types/index.ts)

---

### 3. Reusable UI Components & State Handlers

Create modular, accessible UI components with Framer Motion transitions:
- `GlassCard`: Standardized container with blur, gradient overlay, and hover sheen.
- `GlowButton`: Futuristic cyber button with glowing border and tap micro-interactions.
- `MetricCard`: Stat display with indicator badges, subtext, and trend tags.
- `Badge`: Status badges (Safe, Threat, Demo, Neural).
- `LoadingState`, `EmptyState`, `ErrorState`: Accessible feedback widgets.

#### [NEW] [src/components/ui/GlassCard.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/ui/GlassCard.tsx)
#### [NEW] [src/components/ui/GlowButton.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/ui/GlowButton.tsx)
#### [NEW] [src/components/ui/MetricCard.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/ui/MetricCard.tsx)
#### [NEW] [src/components/ui/Badge.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/ui/Badge.tsx)
#### [NEW] [src/components/ui/States.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/ui/States.tsx)

---

### 4. Layout Shell (Navbar + Sidebar + Root Layout)

Create the responsive application shell:
- **Navbar**: PhishGuard-AR shield logo, tagline *"Detect · Analyze · Resist · Stay Safe"*, horizontal navigation links with animated active pill indicator, search bar placeholder, notification badge, theme toggle placeholder, user profile pill, and mobile menu toggle.
- **Sidebar**: Vertical navigation with Lucide icons, labels, and descriptive tooltips/subtitles. Bottom status card with pulsing live indicator (*"Real-time Protection — AI security engine active"*).
- Responsive collapsing on smaller screens without horizontal scroll.

#### [NEW] [src/components/layout/Navbar.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/layout/Navbar.tsx)
#### [NEW] [src/components/layout/Sidebar.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/layout/Sidebar.tsx)
#### [NEW] [src/components/layout/AppShell.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/layout/AppShell.tsx)
#### [NEW] [src/app/layout.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/layout.tsx)

---

### 5. 3D Cyber Visualization Components (R3F + Three.js)

Create an optimized, interactive 3D cybersecurity environment:
- `CyberGlobe.tsx`: Procedural 3D wireframe/grid sphere with atmosphere glow, orbit rings, subtle mouse parallax, and auto-rotation. Client-side dynamic loading with smooth fallback.
- `CyberShield.tsx`: Holographic floating shield geometry with scanning lines, gentle pulsing glow, and subtle rotation.
- `ParticleField.tsx`: Cyber particle constellation representing network traffic and threat signals.
- `ThreatNodes.tsx`: Interactive demo nodes placed on the globe surface with hover enlargement and click tooltip (*"Threat Node — Demo Visualization"*).
- `DataStreams.tsx`: Curved animated particle stream lines wrapping around the globe.

#### [NEW] [src/components/3d/CyberGlobe.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/3d/CyberGlobe.tsx)
#### [NEW] [src/components/3d/CyberShield.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/3d/CyberShield.tsx)
#### [NEW] [src/components/3d/ParticleField.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/3d/ParticleField.tsx)
#### [NEW] [src/components/3d/ThreatNodes.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/3d/ThreatNodes.tsx)
#### [NEW] [src/components/3d/DataStreams.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/3d/DataStreams.tsx)
#### [NEW] [src/components/3d/SceneContainer.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/3d/SceneContainer.tsx)

---

### 6. Home Page & Interactive Sections

Assemble the Phase 1 command center home page:
- `HeroSection.tsx`: AI-POWERED CYBER DEFENSE badge, "A SAFER DIGITAL TOMORROW" headline with cyan gradient, mission copy, interactive CTA buttons, and embedded 3D cyber world.
- `MetricSection.tsx`: 4 demo metric cards (Messages Scanned, Threats Detected, Accuracy, Response Time).
- `ScanPreview.tsx`: "AI THREAT ANALYSIS" panel with tabs (Text Input, Email Header, Upload File, URL Scan), textarea input, and "Scan with AI" button with a multi-step pipeline animation (INPUT → PREPROCESSING → FEATURE EXTRACTION → AI MODEL → DECISION).
- `AIModelPipeline.tsx`: Visual diagram depicting the dual pipeline (TF-IDF + SVM & Multilingual DistilBERT) converging into the AI DECISION ENGINE with animated flow pulses.
- `LiveThreatMap.tsx`: Visual telemetry panel placeholder with node coordinates and "DEMO TELEMETRY" badge.
- `ThreatActivityChart.tsx`: Polished activity graph component using SVG gradient curves.

#### [NEW] [src/components/home/HeroSection.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/home/HeroSection.tsx)
#### [NEW] [src/components/home/ScanPreview.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/home/ScanPreview.tsx)
#### [NEW] [src/components/home/AIModelPipeline.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/home/AIModelPipeline.tsx)
#### [NEW] [src/components/home/LiveThreatMap.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/home/LiveThreatMap.tsx)
#### [NEW] [src/components/home/ThreatActivityChart.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/components/home/ThreatActivityChart.tsx)
#### [NEW] [src/app/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/page.tsx)

---

### 7. Placeholder Routes

Create styled placeholder pages sharing the same design system for all future phases:
- `/scan`: Threat Scanner Hub
- `/robustness`: Adversarial Robustness Lab
- `/dashboard`: Security Telemetry Dashboard
- `/history`: Scan History & Logs
- `/reports`: Threat Intelligence Reports
- `/settings`: Platform & Defense Configurations

#### [NEW] [src/app/scan/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/scan/page.tsx)
#### [NEW] [src/app/robustness/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/robustness/page.tsx)
#### [NEW] [src/app/dashboard/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/dashboard/page.tsx)
#### [NEW] [src/app/history/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/history/page.tsx)
#### [NEW] [src/app/reports/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/reports/page.tsx)
#### [NEW] [src/app/settings/page.tsx](file:///c:/Users/ABISHEK%20K/PhishGuard-AR/frontend/src/app/settings/page.tsx)

---

## Verification Plan

### Automated Checks
- `npm run lint` inside `PhishGuard-AR/frontend` (ensure 0 ESLint errors)
- `npm run build` inside `PhishGuard-AR/frontend` (ensure successful Next.js production build with strict TypeScript validation)

### Interactive Verification
- Start Next.js dev server (`npm run dev`)
- Verify 3D Scene renders without WebGL/Three.js errors
- Test route navigation between Home, Scan, Robustness Lab, Dashboard, History, Reports, Settings
- Test responsive layout at standard resolutions (1920x1080, 1440x900, 1366x768, tablet, and mobile)
- Test scan preview simulated pipeline animation on "Scan with AI" button click
- Verify reduced motion accessibility styling and no horizontal scrollbars.
