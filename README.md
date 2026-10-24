# Ahmed Amin: portfolio

Source for [www.ahmedhindy.com](https://www.ahmedhindy.com). A static site with no build step, hosted on GitHub Pages.

## Structure

```
index.html                  Home: hero, about, skills, projects, services, experience, certifications, contact
pages/projects/sql.html     Case study: Customer Engagement & Behavior Analysis (featured)
pages/projects/powerbi.html Case study: YouTube's Top 1,000 Channels
pages/projects/tableau.html Case study: E-Learning Onboarding Survey
pages/{projects,career,certifications}.html   Redirects from old URLs to the home page
assets/css/theme.css        Design system (colors, type, spacing, components; light + automatic dark mode)
assets/js/site.js           Mobile nav, active section, scroll reveal, click-to-load Tableau embed
assets/cv/Ahmed_Amin_CV.pdf Your CV (add this file; every "Download CV" button points here)
images/                     Portrait, project screenshots (WebP), certificates, favicons, og-card.png
404.html · sitemap.xml · robots.txt · CNAME · .nojekyll
```

## Adding a project

1. **Screenshot.** Export at least 1400 px wide and convert it to WebP at two widths, for example with
   [Squoosh](https://squoosh.app):
   `images/projects/<slug>-800.webp` and `images/projects/<slug>-1400.webp`.
2. **Card.** In `index.html`, find the `PROJECT CARD TEMPLATE` comment in the Projects section, copy one
   `<article class="card project-card">` block, and change:
   - the two `href`s (image link and title link) to `pages/projects/<slug>.html`
   - the image `src`/`srcset`, plus `width` and `height` (of the 800 px file)
   - the title, the tool `tags`, and the three Problem / Approach / Result rows
3. **Case study page.** Copy `pages/projects/powerbi.html` to `pages/projects/<slug>.html`, then update the
   `<title>`, meta description, canonical and `og:`/`twitter:` URLs and text, and the content inside `<main>`.
   Keep the sections in the same order: Context, My role, Approach, Key insights, plus the details box and live link.
4. **Links.** Add the new page to the "More projects" block on the other case pages and to `sitemap.xml`.
5. **Feature it (optional).** Add `project-card--featured` and the `badge` span to the card, and move the
   card above the grid.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Content rules

- Never name employer clients, accounts, brands or internal projects anywhere, including file names, alt text,
  meta tags and comments.
- Projects must use public or course data only.
