# CLAUDE.md — AutoSplash

## Project overview

Mobile-first web app for a car wash business called **AutoSplash**, built with Next.js and deployed on Vercel. The app simulates a 5-screen mobile app and must be fully functional from any device via a public URL.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Data | Local JSON (`/data/services.json`) |
| Audio | HTML5 `<audio>` + Web Audio API fallback |
| Deployment | Vercel |

---

## Design system

### Color palette

| Token | Hex | Use |
|---|---|---|
| `primary` | `#1E3A5F` | Backgrounds, headers |
| `primary-light` | `#2A4F7C` | Card surfaces, nav bar |
| `accent` | `#38BDF8` | CTAs, highlights, active states |
| `accent-dark` | `#0284C7` | Pressed/hover state on accent |
| `white` | `#FFFFFF` | Text on dark bg, card bg |
| `gray-soft` | `#F0F4F8` | Screen background, list bg |
| `text-muted` | `#94A3B8` | Labels, secondary text |
| `success` | `#4ADE80` | Confirmation feedback |

### Typography

Use **Inter** (Google Fonts) — clean, modern, legible on small screens.

| Role | Size | Weight | Notes |
|---|---|---|---|
| App title (Portada) | `text-5xl` | 800 | Letter-spacing tight |
| Screen heading | `text-2xl` | 700 | |
| Card title | `text-lg` | 600 | |
| Body / description | `text-sm` | 400 | Leading relaxed |
| Label / badge | `text-xs` | 500 | Uppercase tracking |

### Spacing & radius

- Base spacing unit: `4px` (Tailwind default)
- Card border radius: `rounded-2xl` (16px)
- Button border radius: `rounded-full`
- Phone frame: `rounded-[2.5rem]` (40px — realistic bezel feel)

### Shadows & elevation

```css
/* Card lift */
box-shadow: 0 4px 16px rgba(30, 58, 95, 0.12);

/* Floating button */
box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35);

/* Phone frame shell */
box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
```

---

## Layout shell

The app lives inside a centered phone-frame on desktop. On real mobile it fills the viewport.

```
┌─────────────────────────────────────────┐  ← viewport (desktop)
│         ┌──────────────┐                │
│         │  status bar  │                │
│         │              │                │
│         │   CONTENT    │                │
│         │              │                │
│         │  nav / back  │                │
│         └──────────────┘                │
│            max-w: 430px                 │
└─────────────────────────────────────────┘
```

```tsx
// app/layout.tsx — root wrapper
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl overflow-hidden relative">
    {children}
  </div>
</div>
```

---

## Screen specifications

### Screen 1 — Portada (`'portada'`)

**Goal:** impress in 3 seconds, then auto-advance.

**Layout:**
```
┌────────────────────────┐
│    [water drop anim]   │  ← Framer Motion SVG or particle system
│                        │
│      AutoSplash        │  ← text-5xl font-extrabold text-white
│  Tu auto, siempre      │
│      reluciente        │  ← text-lg text-sky-300 italic
│                        │
│  ●  ○  ○  ○  ○        │  ← dot indicator (optional, shows screen progress)
└────────────────────────┘
```

**Background:** `bg-gradient-to-b from-[#0F2744] via-[#1E3A5F] to-[#2A4F7C]`

**Animation ideas (pick one or combine):**
1. **Falling water drops** — 6–8 SVG circle elements, staggered `y` keyframes, `opacity` fade in/out, looping.
2. **Shine sweep** — a diagonal white gradient overlay that slides across the title text (`background-clip: text`).
3. **Ripple rings** — concentric circles expanding from center, like a drop hitting water, `scale` 0→2 with `opacity` 1→0.
4. **Car silhouette** — SVG car outline with animated sparkle dots that light up sequentially.

**Recommended implementation (ripple rings):**
```tsx
{[0, 0.4, 0.8].map((delay, i) => (
  <motion.div
    key={i}
    className="absolute rounded-full border-2 border-sky-400/40"
    style={{ width: 80, height: 80 }}
    animate={{ scale: [1, 3], opacity: [0.6, 0] }}
    transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
  />
))}
```

**Auto-advance:** `useEffect(() => { const t = setTimeout(() => navigate('menu'), 3000); return () => clearTimeout(t); }, [])`

---

### Screen 2 — Menú (`'menu'`)

**Goal:** clear navigation hub. Three large, finger-friendly buttons.

**Layout:**
```
┌────────────────────────┐
│  💧 AutoSplash    ···  │  ← header bar, primary bg
├────────────────────────┤
│                        │
│   Tu lavadero de       │
│   confianza 🚿         │  ← welcome subtext
│                        │
│  ┌──────────────────┐  │
│  │ 🔊 Escucha promo │  │  ← accent bg button
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  🚗 Ver servicios │  │  ← outlined or white bg button
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  📞 Contáctanos  │  │  ← outlined button
│  └──────────────────┘  │
│                        │
└────────────────────────┘
```

**Button hierarchy:**
- Button 1 (audio): full `accent` fill — the hero CTA
- Buttons 2 & 3: `white` fill with `primary` border and text — secondary

**Audio handling:**
```tsx
const audioRef = useRef<HTMLAudioElement>(null);

const playPromo = () => {
  if (audioRef.current) {
    audioRef.current.play().catch(() => playFallbackBeep());
  } else {
    playFallbackBeep();
  }
};

// Web Audio API fallback if promo.mp3 is missing
const playFallbackBeep = () => {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 440;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  osc.start();
  osc.stop(ctx.currentTime + 1.2);
};
```

**Entrance animation:** buttons stagger in from bottom (`y: 30 → 0`, `opacity: 0 → 1`), each 100ms apart.

---

### Screen 3 — Servicios (`'servicios'`)

**Goal:** quickly scannable list; one tap to see full details.

**Layout:**
```
┌────────────────────────┐
│  ← AutoSplash          │  ← back button + screen title
├────────────────────────┤
│  Nuestros servicios    │  ← text-xl font-bold
│                        │
│  ┌──────────────────┐  │
│  │ 🧽 Lavado básico │  │  ← service card
│  │    (coche)       │  │
│  │            $160  │  │  ← price badge (accent color)
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ ...              │  │
│  └──────────────────┘  │
│  (scrollable)          │
└────────────────────────┘
```

**ServiceCard design:**
- White card on `gray-soft` background
- Left side: service icon (emoji or SVG) + name
- Right side: price pill with `accent` background
- `rounded-2xl`, subtle shadow, `active:scale-95` press feedback
- Entrance: cards stagger in (`y: 20 → 0`) with 50ms delay each

**Service icons by category:**

| Category | Icon |
|---|---|
| Lavado básico | 🚿 |
| Lavado completo | ✨ |
| Encerado | 🏅 |

---

### Screen 4 — Detalle (`'detalle'`)

**Goal:** full info at a glance; feel like a receipt or product page.

**Layout:**
```
┌────────────────────────┐
│  ←  Detalle            │
├────────────────────────┤
│  [large hero section]  │  ← service name + color band
│                        │
│  ┌──────────────────┐  │
│  │ Servicio         │  │
│  │ Lavado completo  │  │  ← detail row card
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Precio    $250   │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Descripción      │  │
│  │ Lavado ext + ... │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Duración  45 min │  │
│  └──────────────────┘  │
│                        │
│  [  Reservar ahora  ]  │  ← decorative CTA (non-functional, links to Contacto)
└────────────────────────┘
```

**Detail row component:**
```tsx
<div className="bg-white rounded-2xl p-4 flex justify-between items-start shadow-sm">
  <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">{label}</span>
  <span className="text-sm font-semibold text-primary text-right max-w-[60%]">{value}</span>
</div>
```

**Hero band:** `bg-gradient-to-r from-[#1E3A5F] to-[#38BDF8]` with white service name centered.

---

### Screen 5 — Contacto (`'contacto'`)

**Goal:** instant access to contact info; feel warm and local.

**Layout:**
```
┌────────────────────────┐
│  ←  Contacto           │
├────────────────────────┤
│                        │
│  📍 Dónde estamos      │
│  ┌──────────────────┐  │
│  │ Av. Siempre      │  │
│  │ Limpia 101, CDMX │  │
│  └──────────────────┘  │
│                        │
│  📞 Teléfono           │
│  ┌──────────────────┐  │
│  │ 55-1234-5678     │  │  ← tap to call: href="tel:5512345678"
│  └──────────────────┘  │
│                        │
│  🕐 Horario            │
│  ┌──────────────────┐  │
│  │ Lun–Dom          │  │
│  │ 8:00 – 20:00     │  │
│  └──────────────────┘  │
│                        │
│  [ 💬 WhatsApp ]       │  ← decorative, href="https://wa.me/525512345678"
└────────────────────────┘
```

---

## Screen transitions

All screen changes use a shared `AnimatePresence` + slide pattern:

```tsx
// Entering: slide in from right
// Exiting: slide out to left
<motion.div
  key={currentScreen}
  initial={{ x: '100%', opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: '-100%', opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
```

Back navigation reverses direction (`x: '-100%'` enter, `x: '100%'` exit).

---

## File structure

```
autosplash/
├── app/
│   ├── layout.tsx          # Root layout + Inter font + phone frame shell
│   ├── page.tsx            # All screen state + navigation logic
│   └── globals.css         # Tailwind base + custom keyframe animations
├── components/
│   ├── screens/
│   │   ├── Portada.tsx
│   │   ├── Menu.tsx
│   │   ├── Servicios.tsx
│   │   ├── Detalle.tsx
│   │   └── Contacto.tsx
│   └── ui/
│       ├── Button.tsx       # Rounded button, primary/secondary variants
│       ├── BackButton.tsx   # ← arrow + label
│       └── ServiceCard.tsx  # Card with name, icon, price badge
├── data/
│   └── services.json
├── public/
│   └── audio/
│       └── promo.mp3
├── types/
│   └── service.ts          # Service interface
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

---

## Data — `data/services.json`

```json
[
  {
    "nombre": "Lavado básico (coche)",
    "precio": "$160",
    "descripcion": "Lavado exterior con agua a presión y secado manual.",
    "duracion": "20 min"
  },
  {
    "nombre": "Lavado básico (camioneta)",
    "precio": "$190",
    "descripcion": "Lavado exterior con agua a presión y secado manual.",
    "duracion": "25 min"
  },
  {
    "nombre": "Lavado completo (coche)",
    "precio": "$250",
    "descripcion": "Lavado exterior + aspirado interior + limpieza de vidrios.",
    "duracion": "45 min"
  },
  {
    "nombre": "Lavado completo (camioneta)",
    "precio": "$300",
    "descripcion": "Lavado exterior + aspirado interior + limpieza de vidrios.",
    "duracion": "60 min"
  },
  {
    "nombre": "Encerado (coche)",
    "precio": "$380",
    "descripcion": "Lavado completo + aplicación de cera protectora a mano.",
    "duracion": "90 min"
  },
  {
    "nombre": "Encerado (camioneta)",
    "precio": "$450",
    "descripcion": "Lavado completo + aplicación de cera protectora a mano.",
    "duracion": "2 hrs"
  }
]
```

Import:

```ts
import services from '@/data/services.json';
```

Type:

```ts
// types/service.ts
export interface Service {
  nombre: string;
  precio: string;
  descripcion: string;
  duracion: string;
}
```

---

## State shape (`page.tsx`)

```ts
type Screen = 'portada' | 'menu' | 'servicios' | 'detalle' | 'contacto';
type Direction = 'forward' | 'back';

const [currentScreen, setCurrentScreen] = useState<Screen>('portada');
const [selectedService, setSelectedService] = useState<Service | null>(null);
const [navDirection, setNavDirection] = useState<Direction>('forward');

const navigate = (screen: Screen, direction: Direction = 'forward') => {
  setNavDirection(direction);
  setCurrentScreen(screen);
};
```

---

## Key constraints

1. **No localhost deps** — works from any device via Vercel URL.
2. **No backend, no env vars** — JSON is the entire data layer.
3. **Audio** — `useRef<HTMLAudioElement>` + Web Audio API beep fallback.
4. **Framer Motion only** — no other animation libraries.
5. **No external UI kits** — Tailwind + custom components only.
6. **TypeScript** throughout.
7. **Touch-first** — all tap targets min `44px` tall (WCAG 2.5.5).

---

## Config files Claude Code must create

### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```

### `tailwind.config.ts`
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-light': '#2A4F7C',
        accent: '#38BDF8',
        'accent-dark': '#0284C7',
        'gray-soft': '#F0F4F8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `package.json` (required deps)
```json
{
  "name": "autosplash",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "tailwindcss": "^3",
    "typescript": "^5"
  }
}
```

---

## Known gotchas — fix these proactively

### 1. `"use client"` is required on every component that uses hooks or browser APIs

Next.js 14 App Router renders server-side by default. Every file that uses `useState`, `useEffect`, `useRef`, `framer-motion`, or `AudioContext` **must** have `"use client"` as its very first line. Missing this causes a build error like:

```
Error: useState only works in Client Components. Add "use client" to the top of the file.
```

Affected files: `app/page.tsx`, all `components/screens/*.tsx`, all `components/ui/*.tsx`.

### 2. `AnimatePresence` must wrap conditionally rendered content in a Client Component

Put `AnimatePresence` in `app/page.tsx` (which is already `"use client"`). Do not put it in `layout.tsx`.

### 3. `resolveJsonModule` must be `true` in `tsconfig.json`

Required for `import services from '@/data/services.json'` to work without a type error.

### 4. Inter font via `next/font/google`

Load it in `app/layout.tsx` and apply via CSS variable:

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 5. `promo.mp3` does not exist — do not error

The audio button must silently fall back to the Web Audio API beep. Never throw or show an error UI if the file is missing. The `.catch()` handler on `.play()` covers this.

### 6. `public/audio/` directory must be created even if empty

Create `public/audio/.gitkeep` so the directory exists. Next.js serves `/audio/promo.mp3` from `public/audio/promo.mp3` — if the directory is missing the path still works, but create it for correctness.

### 7. ESLint `no-explicit-any` and `react/display-name`

The default `eslint-config-next` is strict. Avoid `any` types — use the `Service` interface everywhere. Name all components explicitly (not anonymous arrow functions as default exports).

### 8. Framer Motion `exit` animations require `mode="wait"` or `mode="popLayout"` on `AnimatePresence`

Without `mode="wait"`, the exiting and entering screens overlap. Use:
```tsx
<AnimatePresence mode="wait">
```

---

## Build & lint loop — exact sequence

Claude Code must run these steps in order and not stop until every step passes cleanly:

```
1. npm install
2. npm run lint     ← fix ALL warnings and errors before moving on
3. npm run build    ← fix ALL errors; repeat lint → build until clean
```

**Do not skip lint.** A passing build with lint errors is not done.

**Fix-loop rule:** if `npm run build` fails, read the full error output, fix the root cause in the source files, then re-run `npm run build`. Do not move on until it exits with code 0.

**Common build errors and how to fix them:**

| Error | Fix |
|---|---|
| `useState only works in Client Components` | Add `"use client"` to the top of the file |
| `Cannot find module '@/data/services.json'` | Verify `resolveJsonModule: true` in tsconfig |
| `Type 'null' is not assignable to type 'Service'` | Guard with `if (!selectedService) return null` in Detalle |
| `Framer Motion: AnimatePresence requires...` | Add `mode="wait"` to `AnimatePresence` |
| `ESLint: 'X' is defined but never used` | Remove the unused import or variable |
| `'window' is not defined` | Wrap `AudioContext` usage in `typeof window !== 'undefined'` check or inside a click handler |

---

## Commands

```bash
npm install       # Install all deps
npm run lint      # ESLint — must pass with 0 errors
npm run build     # Production build — must exit 0
npm run dev       # Local dev server (http://localhost:3000)
vercel --prod     # Deploy (run manually after build passes)
```

---

## What you (the human) must do after Claude Code finishes

Claude Code cannot do these steps for you:

1. **Verify the dev server looks right**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in a browser. Check:
   - Portada animation plays and auto-advances after ~3 s
   - All three Menu buttons work
   - Each service card navigates to its own detail (not the same one every time)
   - Back buttons return to the correct screen
   - Tap the audio button — you should hear either the promo or the fallback beep

2. **Test on a real mobile device**
   While `npm run dev` is running, open your phone's browser and navigate to `http://<your-local-IP>:3000`. Confirm touch targets feel right and animations are smooth.

3. **Log in to Vercel (one-time)**
   ```bash
   vercel login
   ```
   Choose "Continue with GitHub" (or your preferred method). This only needs to be done once per machine.

4. **Deploy**
   ```bash
   vercel --prod
   ```
   Vercel will print a production URL like `https://autosplash-xxxx.vercel.app`. Copy it.

5. **Test the production URL from your phone**
   Open the Vercel URL on a mobile browser (not localhost). This is the URL you submit. Confirm:
   - Page loads (no 404, no blank screen)
   - Animation plays on Screen 1
   - Audio button works (iOS Safari may require a user gesture — the button tap counts)
   - Navigating to a service and back works correctly

6. **iOS audio note**
   iOS Safari blocks audio until a user interaction. The audio button is a user interaction, so it is fine. Do **not** try to play audio on `useEffect` or on page load — it will be silently blocked.

---

## Done criteria (rubric)

- [ ] Public Vercel URL works from any device (not just localhost)
- [ ] Screen 1: visible looping animation; auto-advances after 3 s
- [ ] Screen 2: audio button plays sound (promo or beep fallback); buttons 2 & 3 navigate
- [ ] Screen 3: full service list from `services.json`; tapping any card navigates to its detail
- [ ] Screen 4: shows ≥ 4 fields; works for every item clicked, not just one hardcoded example
- [ ] Screen 5: phone number, address, and hours all visible
- [ ] All screen transitions are animated (slide in/out)
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run build` exits with code 0
