# IMR LLC — Systems & AI Company Site

## Context
The user wants a more attention-grabbing marketing site that showcases how good the
company is at building systems and shows off projects already shipped. They asked for
three.js, Tailwind, and Next.js (for SEO).

An imported design is attached: `src/imports/IMR_Website__standalone_.html`. It is a
**complete, polished single-page marketing site for "IMR LLC"** (Investment · Management ·
Research) — a firm building custom software, AI agents, automation and orchestration. It
already contains everything the user described: what the company builds, how they work,
results, selected work (shipped projects), history, and team.

Two realities shape the plan:
- The import is a **compiled bundle** (app logic in a base64 JS asset, hero uses a flat 2D
  canvas). It is not cleanly importable, so we rebuild it faithfully as React + Tailwind
  using the extracted content, palette, and fonts.
- The project is **Vite + React + Tailwind v4, not Next.js**. Figma Make runs on Vite;
  Next.js cannot be added without discarding the scaffold. Per the user's confirmed choice,
  SEO is handled the Vite way via `index.html` meta/OpenGraph/Twitter tags.

Confirmed decisions:
- SEO: Vite-friendly meta + OG/Twitter tags (no Next.js).
- Hero: replace the flat 2D canvas with a real **three.js 3D node network** (glowing
  connected nodes drifting in space, subtle mouse parallax), matching the orchestration theme.

## Design truth (extracted from the import)
- **Palette (dark theme):** background `#070b1c` / `#0b1430`; primary blue `#1453ff`;
  cyan accent `#19c6ff`; blue tints `#4d7bff`, `#7da3ff`; muted text `#aab6d6` / `#8b97ba`;
  white `#fff`.
- **Fonts:** headings `Space Grotesk`, body `Manrope` (both public Google Fonts).
- **Motif:** connected node/network graph, glowing dots, gridlines, live-console mockups.
- **Sections (in order):** Nav (IMR logo + links + "Book a call") → Hero (headline
  "Intelligent systems for investment, management & research", CTAs, hero stats, live
  console mock) → marquee of disciplines → `01 What we build` (6 service cards) →
  `02 How we work` (5-step process) → `03/04 The platform` live/scroll section
  (Ingest→Reason→Orchestrate→Compound) + result stat tiles → `04 Selected work` (4 shipped
  project cards with tech tags) → `05 Our history` (2018–2026 timeline) → `06 Who we are`
  (4 team members) → CTA band ("Automate the routine. Compound on the rest.") → Footer.
  All copy is preserved verbatim from the extracted template.

## Styling rules (hard constraints from the user)
- **No inline styles in any `.tsx` file.** No `style={{...}}` attributes and no `CSSProperties`
  objects. TSX carries only `className`s. (The current `App.tsx` placeholder — which is all
  inline styles — is fully removed.)
- **One dedicated CSS file per design section/component**, so each area can be developed and
  expanded independently. Each component imports its own stylesheet, e.g.:
  - `src/components/Nav.tsx` → `src/components/Nav.css`
  - `Hero.tsx` → `Hero.css`, `HeroNetwork.tsx` → `HeroNetwork.css`
  - `Marquee`, `Services`, `Process`, `Platform`, `Work`, `History`, `Team`, `CTA`, `Footer`
    each get a matching `.css` file.
- `src/index.css` holds only the global layer: Tailwind import, Google Fonts `@import`,
  `@theme` tokens, and base body/typography defaults. Shared design tokens live here as CSS
  variables so every section stylesheet references them (`var(--color-blue)`, etc.) — no
  duplicated hex values across files.
- Section CSS files are plain CSS keyed off classes and the shared tokens (utility-class use
  is fine in TSX for trivial layout, but all bespoke visual styling belongs in the CSS files).
- The three.js hero: any dynamic per-frame values that must come from JS (camera/pointer)
  stay in the WebGL calls, not as inline element styles; the mount `<div>` and overlays are
  styled via `HeroNetwork.css`.

## Implementation

### 1. Dependencies
- Install `three` (and `@types/three`). Confirm import name from package exports. No other
  libs needed; Tailwind v4 is already wired.

### 2. Fonts + tokens — `src/index.css`
- Keep `@import 'tailwindcss';` first, then add the Google Fonts CSS2 `@import` for
  `Space Grotesk` and `Manrope` (import rules before all other statements).
- Add a Tailwind v4 `@theme` block exposing the palette above as tokens
  (e.g. `--color-ink`, `--color-blue`, `--color-cyan`, etc.) plus font-family tokens. These
  double as the shared CSS variables that every per-section `.css` file references. Add small
  global base rules (dark body background, default font) — no unlayered `*` reset.
- This is the ONLY place hex values are defined; section stylesheets use `var(--...)`.

### 3. three.js hero background — `src/components/HeroNetwork.tsx`
- A `Canvas`-less approach using raw three.js in a `useEffect`: create scene, perspective
  camera, `WebGLRenderer` (alpha, antialias) mounted into a ref'd `<div>` sized to the hero.
- Build a node network: ~40–60 `Points`/sphere nodes positioned in a loose 3D cloud;
  connect near-neighbors with `LineSegments` (blue→cyan). Nodes get an additive-blended
  glow (sprite/`PointsMaterial`).
- Animate: slow group rotation + gentle drift; **subtle mouse parallax** by easing camera
  (or group) toward pointer position. Respect `prefers-reduced-motion` (freeze motion).
- Handle resize via `ResizeObserver`; dispose geometries/materials/renderer on unmount.
- Render behind hero content with a dark radial vignette so headline text stays legible
  (vignette + mount sizing defined in `HeroNetwork.css`, referenced by `className`).

### 4. Page rebuild — `src/App.tsx` (+ section components under `src/components/`)
- Replace the current dot-grid placeholder `App.tsx` entirely (it is only scaffold).
- Compose the sections listed in Design truth as focused components
  (`Nav`, `Hero`, `Marquee`, `Services`, `Process`, `Platform`, `Work`, `History`, `Team`,
  `CTA`, `Footer`) — keep components small and match the import's layout/spacing/typography.
- `Hero` renders `HeroNetwork` behind the headline, CTAs, hero stat row, and the live
  "console" mock card.
- Each section component imports its dedicated `.css` file and uses only `className`s;
  recreate the node/glow/gridline motifs (borders, gradients, blur) inside those CSS files
  using the shared tokens. Make every section responsive via media queries / `clamp()` in
  its own CSS file (grids collapse to single column) since the import is desktop-captured.
- Preserve all copy verbatim; team members use monogram avatars (AR, MK, TN, SL) as in
  the design.

### 5. SEO — `index.html`
- Set `<title>` to "IMR LLC — Intelligent systems for investment, management & research".
- Add `<meta name="description">`, canonical, theme-color `#070b1c`, and full OpenGraph
  (`og:title/description/type/site_name/image`) + `twitter:card` tags using the site copy.

## Aesthetic
Before writing UI code, invoke `make:aesthetic-stance` (no Make Kit attached). The imported
design's visual language (dark navy, blue/cyan, Space Grotesk/Manrope, node-graph motif) is
the source of truth and takes precedence; use the skill to sharpen craft (contrast, motion
restraint, glow treatment) within that language.

## Verification
- Rely on Vite hot reload (dev server already running on `$PORT`); open the preview.
- Confirm: hero shows an animated 3D node network with mouse parallax and readable text;
  all sections render with correct fonts/palette; layout holds from mobile → desktop.
- Check `figma logs` only if a concrete runtime/WebGL error appears.
- View page source / dev tools to confirm SEO title + meta/OG tags are present.
