# UI/UX enhancement phases (implemented)

| Phase | Focus | Status |
|-------|--------|--------|
| **1** | Design system: **IBM Plex Sans** (body) + **Fraunces** (headings), refined tokens, **`prefers-reduced-motion`** | Done |
| **2** | **Home hero**: editorial headline, dual CTAs, partner strip, slider respects reduced motion | Done |
| **3** | **PageHero variants**: `immersive` (default), `compact`, `minimal` — legal pages use `minimal` | Done |
| **4** | **Home**: impact stats with methodology note, asymmetric mission band, testimonial strip | Done |
| **5** | **Admin**: light sidebar, breadcrumb trail, contextual header title | Done |
| **6** | **Sitewide editorial**: inner pages, news/pub detail, events, get-involved, 404/error | Done |
| **7** | **News category/tag, legal, admin login** — same tokens as public site | Done |

See **`docs/UI-SITEWIDE.md`** for CSS utilities and rollout checklist.

## Follow-up (content / CMS)

- Replace partner strip names with real logos (SVG/PNG) when available.
- Update home stats with verified figures and citations from your annual report.
- Swap testimonial for approved quote + attribution.

## Rolling out PageHero variants elsewhere

```tsx
<PageHero variant="compact" ... />   // shorter inner pages
<PageHero variant="minimal" ... />    // legal, long-form
// default immersive — pillar pages
```
