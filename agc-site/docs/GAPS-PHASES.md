# Content Gaps – Phases Completed

Phased implementation to align with africagovernancecentre.org.

---

## Phase 1: Images & Social Links

**Images**
- Page images can be overridden via env vars (`NEXT_PUBLIC_*_IMAGE`)
- Add AGC images to `public/` and set the corresponding env var (e.g. `NEXT_PUBLIC_HERO_IMAGE=/agc-hero.jpg`)
- Fallback: Unsplash placeholders until real assets are added

**Social Links**
- Social icons only show when URLs are set via env vars
- Set `NEXT_PUBLIC_TWITTER_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, etc. to display icons
- Empty by default to avoid broken links

---

## Phase 2: Footer & Get Involved

**Footer Quick Links**
- Matches live site: About Us, Our Work, Events, APP Summit, News
- Contact is in its own block (address, email, phone)
- Legal links: Privacy Policy, Terms of Service

**Get Involved**
- Added "Join Our Mission" section heading (from live site)

---

## Phase 3: Hero Slider & APP Summit

**Hero Slider**
- Home page hero uses a 3-slide carousel (6s auto-rotate)
- Dots for manual navigation
- Override via `NEXT_PUBLIC_HERO_SLIDER_IMAGES` (comma-separated URLs)

**APP Summit**
- Placeholder structure for future content (`upcomingDate`, `venue`, `highlights`)
- "More summit details coming soon" banner when `detailsComingSoon: true`
- Set `detailsComingSoon: false` and fill fields when real content is available

---

## Next Steps (Manual)

1. Add real AGC images to `public/` and set env vars
2. Add real social URLs when available
3. Populate APP Summit when live page content is accessible
4. Add Events/News via /admin or static content
