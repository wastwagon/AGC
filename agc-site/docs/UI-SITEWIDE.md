# Sitewide UI (editorial / human-development)

Shared patterns so inner pages match the homepage—not generic “AI template.”

## CSS utilities (`globals.css`)

| Class | Use |
|-------|-----|
| `page-section-paper` | Cream panel `#fffcf7` |
| `page-section-warm` | Soft warm wash + border |
| `page-prose` / `page-prose-tight` | Body copy (stone, comfortable line height) |
| `page-heading` | Fraunces-style section titles |
| `page-card` | Bordered card on paper |

## Brand surfaces (logo teal `#2e728c` → `accent-*`)

- **Deep band:** `bg-accent-900` (`#0e1f26`) + cream text + **teal** micro-labels (`text-accent-300`)
- **Hero overlays:** `from-stone-950` → `via-accent-900` → `to-accent-600/30` (no forest green / orange)
- **Pull quotes / borders:** `border-accent-600`; icon chips `bg-accent-100`

## Phases applied

1. **Detail:** `/news/[slug]`, `/publications/[slug]` — overlapping paper card, editorial hero, topic strip
2. **Events:** register page + `EventRegistrationForm` + printable badge — paper + deep green sidebar
3. **Get involved + applications:** numbered lists, CTA bands, form on `page-card`
4. **Errors:** `not-found.tsx`, `error.tsx` — warm canvas, human copy
5. **News taxonomy:** `/news/category/[slug]`, `/news/tag/[slug]` — paper section, `NewsFilters` on paper
6. **Legal:** `privacy-policy`, `terms-of-service` — carded sections, deep green contact band
7. **Admin login:** warm full-bleed background, `page-card` sign-in panel (see `admin-shell.tsx` login branch)

## When adding a page

1. Use `PageHero` (`compact` / `minimal` / default).
2. Main content: `page-section-paper` or `page-section-warm` + `max-w-3xl` or `max-w-6xl` as needed.
3. Prefer `page-card` over raw `bg-white border-slate-200`.
4. Section labels: `text-xs font-semibold uppercase tracking-wider text-black` or `text-accent-800`.
