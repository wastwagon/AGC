# Consultar Home 3 – Code Mapping & Implementation

Exact template locations and how to replicate with AGC content.

---

## 1. Header (Full Layout)

**Template files:**
- `consultar/components/header/index.js` – main header
- `consultar/components/HeaderTopbar/index.js` – top bar
- `consultar/styles/sass/layout/_header.scss` – header styles

**Structure:**
```
<header>
  <HeaderTopbar />  <!-- Dark navy bar -->
  <div class="wpo-site-header">  <!-- White nav -->
    Logo (left) | Nav (center) | CTA + Search (right)
  </div>
</header>
```

**Topbar** (`_header.scss` lines 9–155):
- Background: `#283a5e`
- Left: address (ti-location-pin), email (flaticon-email)
- Right: "Visit our social pages" + social icons (ti-facebook, ti-twitter-alt, ti-instagram, ti-google)

**Main nav** (`_header.scss` lines 162–900):
- White background
- Logo: `navbar-brand` (col-lg-3)
- Nav: centered `#navbar` (col-lg-6), `justify-content: center`
- Right (col-lg-3): `theme-btn` ("Free Consulting") + `search-toggle-btn` (light blue `#dadffb`, 55×50px, rounded)

**Nav link hover** (lines 246–262):
- `>ul>li>a:before` – 4px accent bar on top, opacity 0 → 1 on hover

---

## 2. Hero Slider (Home 3)

**Template files:**
- `consultar/components/hero3/index.js` – hero component
- `consultar/styles/sass/layout/_hero-slider.scss` – lines 333–565

**Structure:**
```jsx
<section className="wpo-hero-slider">
  <Slider>  <!-- react-slick, fade, arrows -->
    <div className="hero-slide">
      <div className="slide-inner slide-bg-image" style={{ backgroundImage: url }}>
        <div className="container">
          <div className="slide-content">
            <div className="wpo-hero-title-top"><span>Sub-heading</span></div>
            <div className="slide-title"><h2>Main title</h2></div>
            <div className="slide-text"><p>Description</p></div>
            <div className="slide-btns"><Link className="theme-btn">Get Started</Link></div>
          </div>
        </div>
      </div>
    </div>
  </Slider>
</section>
```

**Key styles:**
- `wpo-hero-slider`: height 900px (600px tablet, 500px mobile)
- `slide-inner`: full size, `background-size: cover`, `text-align: left`
- `slide-content`: `padding-bottom: 70px`
- `wpo-hero-title-top span`: 22px, color #e4e4e4
- `slide-title h2`: 70px, font-weight 900, white
- `slide-text p`: 25px, border-left 2px #e2e2e2, padding-left 20px, color #e2e2e2
- Arrows: `slick-prev`/`slick-next`, 45×45px circle, accent color, visible on hover

---

## 3. Feature Cards (Overlapping Hero)

**Template files:**
- `consultar/components/Features/index.js` – features component
- `consultar/styles/sass/page/_home-style3.scss` – lines 8–45

**Home 3 usage:** `featuresClass="wpo-features-section-s2"`

**Key styles** (`_home-style3.scss`):
- `margin-top: -60px` – overlaps hero
- `z-index: 11`, `position: relative`
- `wpo-features-item`: white bg, `box-shadow: 0px 5px 15px rgba(62,65,159,0.1)`, padding 60px
- `wpo-features-icon`: circular, contains icon image
- `wpo-features-text h2`: bold title
- `wpo-features-text p`: grey description

**Content:** 3 cards – Strategy and Planning, Market Analysis, Investment Strategy

---

## 4. AGC Mapping

| Consultar | AGC |
|-----------|-----|
| Topbar address | siteConfig.address |
| Topbar email | siteConfig.email.programs |
| "Visit our social pages" | Social links |
| "Free Consulting" | "Get Involved" |
| Hero sub-heading | heroContent or tagline |
| Hero title | heroContent.title |
| Hero description | heroContent.subtitle |
| "Get Started" | heroContent.cta |
| Feature 1 | Programs |
| Feature 2 | Projects |
| Feature 3 | Advisory |

---

## 5. Implementation Checklist

- [ ] Header: topbar always on (including home)
- [ ] Header: search button (light blue square)
- [ ] Header: CTA "Get Involved" (gradient)
- [ ] Hero: full-width slider with background images
- [ ] Hero: left-aligned content, white text
- [ ] Hero: prev/next arrows on hover
- [ ] Features: 3 cards with -60px overlap
- [ ] Features: Programs, Projects, Advisory
