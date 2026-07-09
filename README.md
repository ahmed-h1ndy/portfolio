# Ahmed Hindy — Data Analyst Portfolio

Source for [www.ahmedhindy.com](https://www.ahmedhindy.com), a static portfolio site for a data
analyst specializing in Power BI, Tableau, SQL, Python, and Advanced Excel.

## Stack

- Hand-written HTML + a single CSS design system (`assets/css/theme.css`).
- One small vanilla-JS file (`assets/js/site.js`) — **no libraries, no build step**. It handles
  the mobile nav, scroll reveals, count-up stats, the project filter, the certificate lightbox,
  the hero particle canvas, the scroll-progress bar, and the click-to-load Tableau embed.
- Fonts: Space Grotesk (body) + Unbounded (display) via Google Fonts.
- Icons: Font Awesome 5 Free (bundled locally).
- Hosted on GitHub Pages (`CNAME` → www.ahmedhindy.com).

## Structure

```
index.html                     Home
pages/
  projects.html                Project hub (filterable)
  certifications.html          Certifications hub
  career.html                  Career timeline
  hobbies.html                 Hobbies
  projects/*.html              Per-technology project pages
  certifications/*.html        Tracks, internships
  certifications/courses/*.html  Technical & soft-skill courses
assets/css/theme.css           Design system
assets/js/site.js              Interactions
assets/cv/                     CV (PDF)
images/                        Portrait, project shots, certificate scans, logos
sitemap.xml · robots.txt · 404.html
```

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Accessibility & performance notes

- Respects `prefers-reduced-motion` (all animation is gated).
- Images carry `width`/`height` and lazy-load below the fold.
- Skip-to-content link, visible focus states, keyboard-operable lightbox and nav.
