# AGENTS.md — instructions for AI coding agents

This file is for any AI agent (Claude, Gemini, GPT, Cursor, etc.) picking up
this codebase. Read this before making changes. It tells you what exists,
why it's built this way, and the rules to follow so changes don't break the
design system or the working parts of the page.

## What this project is

A frontend-only redesign of the Amity Coding Club website. Plain HTML/CSS/JS
— no framework, no build step, no `npm install`. Everything runs by opening
`index.html` in a browser. External libraries (Three.js, GSAP, fonts, icons)
load from CDNs via `<script>`/`<link>` tags already in `index.html` — do not
add a bundler, package.json, or framework unless the human explicitly asks
for a stack migration.

## File map

| File | Owns |
|---|---|
| `index.html` | All markup, section structure, placeholder copy, CDN script/link tags |
| `styles.css` | Design tokens (`:root` and `[data-theme="light"]`), layout, responsive rules |
| `script.js` | Theme toggle, nav behavior, custom cursor, tabs, scroll reveals, count-up, tilt, form, and all three Three.js scenes |
| `README.md` | Human-facing docs: stack, install/run, design rationale |

There is no CSS-in-JS, no inline `<style>` blocks, and no separate JS modules
— keep it that way. One file per concern, as above.

## Design tokens — do not hardcode values that already exist as tokens

All colors, spacing, and radii are CSS custom properties defined once in
`styles.css`, under `:root` (dark, default) and `html[data-theme="light"]`
(light override). Both blocks must always define the same set of variable
names — if you add a new color role, add it to *both* blocks in the same
edit, or the light/dark toggle will silently break for that value.

Token families: `--bg`, `--surface`, `--surface-2`, `--primary`,
`--primary-strong`, `--secondary`, `--cta`, `--text-primary`,
`--text-secondary`, `--text-muted`, `--border`, `--success`, `--warning`,
`--danger`, plus `--space-*`, `--radius-*`, and font families
(`--font-display`, `--font-body`, `--font-mono`).

Never write a raw hex value in `styles.css` outside the two token blocks.
Never write a raw hex value in `script.js` without also reading it from
`root.getAttribute('data-theme')` so it flips with the toggle (see the
`themeColors()` / `updateColor()` pattern already used in each Three.js
scene — copy that pattern for any new WebGL element).

## Section pattern — how to add a new section

Every section follows this shape in `index.html`:

```html
<section class="section <name>" id="<name>">
  <div class="section-inner">
    <h2 class="section-title">...</h2>
    <!-- content -->
  </div>
</section>
```

`.section` gives consistent vertical padding; `.section-inner` gives the
max-width and horizontal padding. Do not set width/padding directly on a
new section — nest content inside `.section-inner` instead, or spacing will
drift from every other section.

If the new section needs its own background tint, add a scoped class (see
`.about`, `.stats`, `.tech` in `styles.css` — they just set `background:
var(--surface)`), not an inline style.

## Motion rules — preserve these constraints

The brief this site was built against explicitly penalizes animating
everything. The current pattern is: **one signature 3D/shader moment per
major section** (hero wave plane, about wireframe, CTA particles), plus
restrained scroll-reveals and hover feedback elsewhere. When adding new
interactions:

- Do not add scroll-triggered animation to every element — only to
  meaningful section entries, following the existing `.reveal` /
  `IntersectionObserver` pattern in `script.js`.
- Any new canvas/WebGL element must check `typeof THREE === 'undefined'`
  before running (CDN might fail to load) and must gate its animation loop
  behind `prefersReducedMotion` the same way the three existing scenes do.
- Any new hover/cursor effect must be skipped when
  `window.matchMedia('(hover: none)').matches` is true (touch devices) —
  see `initCursor()` and `initTilt()` for the pattern.
- Respect `prefers-reduced-motion` in CSS too: new `@keyframes` animations
  must be covered by the existing blanket rule at the top of `styles.css`
  (they already are, via the `*` selector) — don't add animations with
  `!important` durations that would bypass it.

## Responsive rules

Breakpoints already in use, in `styles.css`, top to bottom:
`1280px`, `1024px`, `900px` (nav collapses to burger menu here), `768px`,
`480px`, `390px`. Add new responsive rules inside the existing `@media`
blocks at the matching breakpoint rather than creating new ones, unless a
genuinely new breakpoint is required.

## Before you commit a change, verify

1. `node --check script.js` — must pass with no output (no syntax errors).
2. Every color you added exists as a token in **both** the dark and light
   `styles.css` blocks.
3. Every new interactive/animated element degrades gracefully: works
   without JS errors if a CDN fails, respects `prefers-reduced-motion`, and
   doesn't break on touch devices.
4. Open `index.html` directly (no build step) and confirm it still renders
   — this project has no build/compile step, so a rendering bug is a
   shipped bug.
5. Don't introduce a package manager, bundler, or framework as a
   side-effect of an unrelated change — if a task genuinely requires one,
   stop and ask the human first.

## What NOT to do

- Don't rename existing `id`/class names used by `script.js` (`#nav`,
  `#theme-toggle`, `.reveal`, `.tech-chip`, `.project-card`, etc.) without
  updating every reference in `script.js` — several behaviors are wired by
  exact selector match, not data attributes.
- Don't replace the mock/placeholder content with a live backend, database,
  or auth flow — this is explicitly a frontend-only deliverable.
- Don't add a CSS framework (Bootstrap, Bulma, etc.) on top of the existing
  hand-built system — it will conflict with the token system and undo the
  "not a generic template" design goal this was built for.
