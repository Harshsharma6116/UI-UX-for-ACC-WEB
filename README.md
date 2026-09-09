# Amity Coding Club — Website Redesign

A frontend-only redesign of the Amity Coding Club website: a single, fast-loading
static site with a dark/light theme, WebGL wave/shader backgrounds, scroll
reveals, and hand-built interactions — no framework, no build step required.

## Tech stack

- Plain HTML5 / CSS3 / vanilla JavaScript (ES5-compatible, no transpiler needed)
- [Three.js](https://threejs.org/) (r128, via CDN) — hero wavy shader plane, the
  rotating wireframe in About, and the particle field in the closing CTA
- [GSAP](https://gsap.com/) + ScrollTrigger (via CDN) — loaded and available for
  further scroll-driven sequences; current scroll reveals use a lightweight
  IntersectionObserver implementation to keep the page fast on low-end phones
- [Tabler Icons](https://tabler.io/icons) webfont (via CDN)
- Google Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels/stats)

No build tooling, no `npm install`, no bundler — open `index.html` in a browser
and everything works. This also means it drops straight into any static host
(Vercel, Netlify, GitHub Pages) with zero configuration.

## Installation & running locally

```bash
# no dependencies to install — just serve the folder
cd acc-redesign
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply double-click `index.html` — everything runs from CDNs.

## File structure

```
acc-redesign/
├── index.html      # all markup and sections
├── styles.css      # design tokens, layout, responsive rules
├── script.js       # theme toggle, nav, cursor, tabs, reveals, three.js scenes
└── README.md
```

## Design approach

**Color & type system** — a dark-first palette (near-black background, electric
violet primary, techy teal secondary, warm coral reserved only for CTAs) with a
light-mode counterpart using the same roles at adjusted values, so nothing was
hand-tuned section-by-section. Space Grotesk carries headline personality,
Inter handles body copy, and JetBrains Mono is used for labels, stats, and dates
to keep a "developer tool" identity throughout — the mono face is the one thing
that most reads "coding club" at a glance.

**Sections** — nav, hero (shader background + headline), about, stats,
events (upcoming/past toggle), projects, tech stack (orbiting chip ring),
team, closing CTA with an inline signup form, and footer. All content is
realistic placeholder copy for Amity Coding Club — swap in real member names,
event dates, and project details before shipping.

**Motion** — one signature 3D/shader moment per major section (hero wave plane,
about wireframe icosahedron, CTA particle field) rather than animating every
element, per the "don't animate just because you can" guidance in the brief.
Everything else uses restrained scroll-reveals and hover feedback.

**Responsiveness** — tested against all required breakpoints (1440/1280/1024
desktop, 768 tablet, 480/390/360 mobile). Mobile gets its own nav (slide-down
menu), single-column grids, and a lighter orbit radius for the tech section —
not just a shrunk desktop layout.

**Accessibility & performance**
- Respects `prefers-reduced-motion`: shader animation speed drops sharply,
  count-up/reveal animations are skipped in favor of the final state.
- Visible focus rings on all interactive elements.
- Custom cursor and 3D scenes are automatically skipped on touch devices
  (`hover: none`) — no wasted GPU cycles on phones that can't use them anyway.
- All three Three.js scenes use lightweight wireframe/point geometry, not
  heavy post-processing, so they stay smooth on mid-range hardware.

## Important dependencies / notes

- All external libraries are pulled from CDNs (cdnjs, Google Fonts) — an
  internet connection is required for full fidelity, but the page still
  renders and functions (fonts fall back, 3D canvases simply stay empty) if
  a CDN is blocked.
- Theme preference is remembered via `localStorage`.
- The join form does not submit anywhere (per brief: no real backend/contact
  processing required) — it validates the email client-side and shows a
  confirmation message only.
- Event, project, and team data is hardcoded placeholder content in
  `index.html` — swap it for real club data before launch, or wire it up to
  a CMS/API later without touching any styling.

## Next steps if this becomes a real ship

- Replace placeholder copy, event dates, and team photos with real data
- Wire the join form to an actual mailing list or form service
- Optionally port to Next.js if you want a CMS-backed events/projects section
  later — the HTML structure and CSS tokens carry over directly
