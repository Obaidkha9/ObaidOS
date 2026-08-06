# Obaid OS

A portfolio that doesn't feel like a website — it feels like a personal
operating system. Visitors land on an **iOS-style Lock Screen**, unlock into a
**Home Screen**, and explore the work by opening **apps** with authentic iOS
open/close animations. Music plays throughout and lives in a morphing
**Dynamic Island**.

## Stack

- **Next.js 16** (App Router) · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme`)
- **Framer Motion** — spring-based app transitions, Dynamic Island morph
- **GSAP** — available for timeline flourishes
- **Zustand** — global OS state (lock, windows, island, music)
- **Lenis** — smooth scrolling inside apps
- Custom **persistent audio engine** (music survives navigation)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
app/                     layout + single page (renders <OSShell/>)
lib/
  store.ts               Zustand OS state machine
  content.ts             ← ALL portfolio content lives here (edit freely)
  apps.ts                app registry (icons, colours, dock)
  utils.ts               cn(), spring presets, time formatting
components/
  os/                    OSShell, LockScreen, HomeScreen, DynamicIsland,
                         AppWindow, Wallpaper, StatusBar, AudioEngine, SmoothScroll
  apps/                  NotesApp (About), FilesApp (Experience), TimelineApp,
                         ProjectsApp, CameraApp, PhotosApp, MusicApp, ResumeApp,
                         MailApp, AppChrome (shared)
  icons/glyphs.tsx       iOS-style SVG app glyphs
```

## Adding your assets

- **Music:** drop MP3s in `public/music/` (see the README there) or edit
  `PLAYLIST` in `lib/content.ts`.
- **Resume:** add `public/CV_2026.pdf` (the Resume app links to it).
- **Photos/Projects:** currently gradient placeholders — swap for images by
  editing `lib/content.ts` and the relevant app component.

## Interactions

- **Unlock:** scroll/mouse-wheel up, drag up, or swipe up (mobile). Tap the
  "swipe up" hint too.
- **Open app:** tap an icon — it expands from its position into a full window.
- **Close app:** tap/swipe the home indicator, press `Esc`, or tap **Done**.
- **Dynamic Island:** tap to expand into full music controls.

## Accessibility & performance

- Respects `prefers-reduced-motion` (disables springs, parallax, Lenis).
- Keyboard: `Esc` closes apps; icons/controls are focusable buttons.
- App bodies are code-split via `next/dynamic` (lazy loaded on open).
