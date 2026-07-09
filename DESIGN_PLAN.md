# Portfolio Design Review & Implementation Plan (v2)

Full design review and implementation plan for ahmedhindy.com (static HTML/CSS site, GitHub
Pages, custom `theme.css`). Goal: a portfolio that makes a recruiter comparing it against the CV
stop and pay attention — polished, fast, credible, and unmistakably the work of a data analyst.

**Content source of truth: `Ahmed_Amin_CV_DataAnalyst.docx` (repo root).** Where the site and CV
disagree, the CV wins. Its extracted content is embedded in §2 below so implementation does not
need to re-parse the docx.

**Priority order: Phase 0 (repairs) → Phase 1 (design system) → Phase 2 (content sync from CV) →
Phase 3 (page redesigns) → Phase 4 (signature "wow" features) → Phase 5 (motion & performance) →
Phase 6 (SEO/meta/cleanup).** Implement fully, in order; verify per the checklist in §10.

---

## 1. Current state (findings from review)

- `index.html` + level-2 pages (`pages/*.html`) use the new dark/neon theme with a styled
  pill header (`.site-header__frame`), preloader, custom cursor, Lenis, GSAP, Three.js.
- **All 10 level-3 pages** (`pages/projects/*.html`, `pages/certifications/*.html`,
  `pages/certifications/courses/*.html`) use `.site-header__inner` — a class that does
  **not exist** in `theme.css`. Their headers render completely unstyled.
- **~12 classes used in HTML have no CSS at all**: `.page-intro`, `.mosaic`, `.mosaic__item`,
  `.hobby__label`, `.project-card` (standalone), `.project-card__image`, `.project-card__footer`,
  `.section__description`, `.timeline__role`, `.timeline__bullets`, `.hero__lead`,
  `.site-header__inner`. The hobbies "mosaic" and all deep project pages look unfinished
  (giant unstyled full-width images, plain text footers).
- **Invisible mouse cursor bug**: `theme.css` sets `cursor: none` on `body, a, button, input,
  textarea, .chip` under `@media (pointer: fine)`, but level-3 pages don't include the
  `#cursor`/`#cursor-follower` divs (and don't load GSAP) — on those 10 pages users have
  **no visible cursor at all**.
- Level-3 pages don't load Lenis/GSAP CDNs → scroll feel and animations differ per page.
- Invalid Font Awesome icons (bundled FA is **Free 5.15.4**): `fa-sigma` and `fa-presentation`
  (Pro-only) in `pages/certifications/courses/technical.html` and `soft-skills.html` → blank squares.
- **40+ certificate scans in `images/Certificates/` are never displayed anywhere.** Company logos
  in `images/Career/` unused. Homepage/projects-hub cards are icon-only while real dashboard
  screenshots sit unused on disk.
- Site content is stale vs. CV (see §2): old job title, missing promotion, missing the strongest
  project (Center of Excellence reporting suite), outdated cert list, fluffy unquantified copy.
- ~1 MB dead template assets (`assets/css/main.css`, jQuery + 5 plugin files, `noscript.css`,
  `assets/sass/`, `images/pic01–11.jpg`, `banner.jpg`) + ~2.2 MB duplicated images
  (`images/Certificates/top-certificates/`, `images/Projects/Top Projects/`).
  `Bloomberg.png` is 1.1 MB ×2; `asu.png` 424 KB.
- Fake preloader (~2 s artificial delay, re-runs on level-2 navigations). No
  `prefers-reduced-motion` handling anywhere. Three.js (~600 KB) runs an O(n²) particle loop with
  per-frame array allocation, including on mobile.
- No CV download, no email contact, no OG/Twitter meta, no canonical/JSON-LD/sitemap/robots/404.
  Images lack `width`/`height` and `loading="lazy"`. Inline styles sprinkled around.
- Component sprawl: 3 near-identical label components (`.chip`/`.tag`/`.pill`), 5 near-identical
  cards (`.card`/`.story-card`/`.case-card`/`.stack-card`/`.cert-card`).

---

## 2. Content source of truth (extracted from the CV)

> ⚠ **Branding flag (open item, needs Ahmed's confirmation):** the CV headline says **AHMED AMIN**;
> the site brand, domain, and LinkedIn say **Ahmed Hindy** (and git says Ahmed Mostafa). A recruiter
> holding the CV and opening ahmedhindy.com sees two different names. Default assumption for
> implementation: **keep "Ahmed Hindy" as the site display brand** (matches domain + LinkedIn) but
> do NOT invent a third variant anywhere. If Ahmed prefers "Ahmed Amin" site-wide, it's a
> find-and-replace across headers/footers/titles/JSON-LD at the end. Surface this question in the
> handoff summary.

**Identity / contact**
- Title: Data Analyst | Power BI, Tableau, SQL, Python, Advanced Excel
- Cairo, Egypt · **email for site: `ahmed@ahmedhindy.com`** (professional domain email — use this,
  NOT gmail) · linkedin.com/in/ahmedhindy02 · ahmedhindy.com
- **Never publish the phone number on the website** (it's on the CV PDF only; keeps spam away).

**Positioning (use for hero lead / meta descriptions — quantified, replaces fluffy copy):**
Data analyst with 2 years of hands-on experience turning complex operational datasets into
dashboards, reports, and action plans with Excel, Power BI, Tableau, SQL, and Python. Delivers
daily/weekly KPI reporting in production — cut reporting time by 60% and drove a 30% performance
gain through data-backed recommendations.

**Experience (site timeline must match exactly — titles, dates, quantified bullets):**
1. **Senior Quality Analyst — Concentrix** · Nov 2025 – Present · Cairo
   - Owns daily/weekly analysis & reporting in Excel (audit & coaching attainment, critical
     errors, utilization, compliance) feeding weekly business reviews; **cut reporting time 60%**
     through automation.
   - Partnered with the client on SOP improvements from agent-feedback analysis, **improving
     account performance 30%**.
   - Leads root-cause analysis on quality/performance trends; turns findings into action plans
     across agents, team leads, and QA workflows.
   - Manages stakeholder/client communication: insights, calibrations, performance decisions.
2. **AI Engineer — Bitline** · Sep 2024 – Nov 2024 · Remote
   - Web scraping + preprocessing pipelines in Python: **–80% collection time, +90% data volume**.
   - RAG systems with open-source LLMs (**Mistral via Ollama**); owned data workflow end-to-end:
     collection, cleaning, embedding, prompt-tuning.
3. **Blended Account Advisor — Concentrix** · Sep 2024 – Nov 2025 · Cairo
   - **Top achiever 10 consecutive months, incl. top performer for a full quarter** across calls,
     chats, emails, tickets.
   - Flagged recurring pain points and process gaps, informing quality/process improvements.
4. **B.Sc. Computer Science — Ain Shams University** · 2020 – 2024 · GPA 3.2/4.0, with Honors.

**Projects (CV order = priority order for the site):**
1. **Call Center "Center of Excellence" Reporting Suite (Excel)** · Dec 2025 – Present — ⭐ NEW,
   not on the site yet; this is now the flagship project.
   - Multi-tab Excel reporting suite, the account's single source of truth; each tab a standalone
     report: audit attainment, coaching attainment, weekly quality, compliance, audit-over-audit
     consistency, D-Sat bucketing.
   - **Tracks 3 years of performance, ~250,000 calls; used by QA & operations leaders weekly.**
   - Analysis of volume vs. quality revealed a **30% SLA drop during peak hours**.
   - NOTE: internal production work — do NOT fabricate screenshots of it. Reuse the existing
     `images/Projects/Excel/callCenterKPIDashboard.jpeg` visual (it's the same domain) or a
     designed cover card (§5), and describe with the numbers above.
2. **Customer Engagement Analysis (SQL & Tableau)** · Sep 2025 — SQL CTEs/views over **35,000+
   students**; Tableau dashboards for learning/engagement/revenue; recommendations on low
   conversion in India & Nigeria, campaign timing. (Already on site; add the 35K metric.)
3. **YouTube Top 1,000 Channels (Power BI)** · Mar 2025 — interactive dashboard: algorithm trends,
   retention, globalization. (Site inconsistently calls it SQL/Python on index — fix to Power BI.)
- Keep on site (not on CV, still good): Real Estate Market Analysis (Python), E-Learning
  Onboarding Survey Dashboard (Tableau), Amazon Web Scraping (Python).

**Skills (align site to CV; site currently overclaims R/scikit-learn — drop or demote those):**
- Analytics & BI: Power BI · Tableau · Advanced Excel · SQL · dashboards · KPI reporting ·
  data modeling · data cleaning · root-cause analysis
- Programming & AI: Python (pandas, NumPy, Matplotlib, Seaborn) · web scraping · data pipelines ·
  GenAI · RAG · LLMs (Mistral, Ollama)
- Business: requirements gathering & documentation · client communication & expectation
  management · stakeholder management · process improvement · Jira · Slack

**Certifications (update site lists; add years):**
- 365 Data Science Career Tracks: **Power BI Developer (2026)** ⭐ new · Tableau Developer (2025) ·
  Data Analyst (2025). (Site also mentions Data Engineer & AI Engineer tracks — keep them on the
  certifications page since scans exist, but the three CV ones lead.)
- Virtual internships: Deloitte Australia — Data Analytics (2025) · **British Airways — Data
  Science (2025)** ⭐ new to feature (scan exists: `images/Certificates/virtual-internships/British_Airways.jpg`).
  Bloomberg, Datacom, NSW Government, Quantium stay in the gallery.

**Headline numbers for stats/callouts (reuse everywhere — hero stat band, project chips, OG card):**
`2+ yrs experience` · `–60% reporting time` · `+30% account performance` · `250K calls analyzed` ·
`35K+ students analyzed` · `10 mo top achiever` · `1,000 channels profiled` · `–80% collection
time / +90% data volume` · `top 2% chess (1700+)`.

---

## 3. On AI-generated images — decision: NO for projects (with better alternatives)

Recommendation is to **not** use AI-generated photos for project snippets, and Opus should not
generate/add any. Reasoning (share with Ahmed):
- Recruiters and hiring managers in analytics evaluate *the actual dashboards*. A real Tableau/
  Power BI/Excel screenshot is evidence; an AI illustration is decoration and reads as filler.
- Generic AI imagery is now a recognizable pattern and invites the exact wrong question ("is the
  rest of this portfolio AI-filler too?"). For a portfolio whose goal is credibility-shock, the
  risk/reward is upside-down.
- Real screenshots already exist on disk for the flagship work.

**What to do instead (this is the "shock" strategy for visuals):**
1. **Real screenshots, premium presentation** (§5): every screenshot gets an identical treatment —
   cropped to `aspect-ratio: 16/10`, inside a minimal "browser chrome" frame (three dots + thin
   top bar, pure CSS), on a subtle radial-glow backdrop, gentle zoom on hover. Consistency of
   framing is what makes work look curated instead of pasted.
2. **Designed SVG cover cards** for projects with no shareable screenshot (Real Estate analysis,
   SQL-only work, web scraping, the confidential CoE suite if preferred): hand-built SVGs in the
   site's design language — dark surface, faint gridlines, a stylized chart motif (bars/line/
   scatter) in the accent color, project title + tool badge. These are made by Opus in code
   (deterministic, on-brand), not generated imagery. Store in `images/covers/*.svg`.
3. Acceptable AI-image exception (optional, low priority): an abstract background texture for the
   OG/social card ONLY — and even there, a CSS/SVG gradient composition is preferred and is the
   default.

---

## 4. Design direction

Keep the **dark, data-themed identity** but move from "neon cyberpunk template" to
**refined analytics studio**:

1. **One hero accent, used sparingly.** Teal/cyan family stays primary but deepened
   (`--accent: #2ee6c8`, hover `#5ff0d8`). Magenta `#f973ff` demoted to soft violet `#b07ff5`
   as a rare secondary (h1 gradient, one highlight per screen max) — or omitted entirely.
   Kill the pervasive pink glows on header/buttons/cards.
2. **Calmer surfaces.** Body = near-black blue-tinted `#07090f` + ONE subtle top radial glow.
   Two opaque elevation levels (`--surface-1: #0d1119`, `--surface-2: #131826`), one border token
   pair. Shadows cut ~70% (max `0 12px 32px rgba(0,0,0,.4)`; current cards use `0 35px 55px`).
3. **Typography discipline.** Body: Space Grotesk. Unbounded restricted to homepage h1 + section
   h2s only; subpage h1s become Space Grotesk 600 `clamp(1.9rem, 3.5vw, 2.6rem)`. Uppercase +
   letter-spacing reserved for eyebrows/small labels only (remove from buttons, meta rows, card
   footers). `font-variant-numeric: tabular-nums` for all stats/dates. Scale:
   0.8 / 0.9 / 1 / 1.125 / 1.35 / 1.7 / 2.2 / 3 rem.
4. **Data-analyst signature details** carry the personality (replacing glow-everything): faint
   1px gridline pattern (3–4% white) in the hero visual panel; small sparkline SVG divider under
   section eyebrows; monospace/tabular numerals for metrics; KPI-style stat chips on project cards.
5. **Radius scale down**: 8 / 14 / 20px (sm/md/lg). Header pill stays.

---

## 5. Phase-by-phase implementation

### Phase 0 — Repair broken pages (mandatory, first)

1. **Header fix on all 10 level-3 pages**: `class="site-header__inner"` →
   `class="site-header__frame"` in `pages/projects/*.html` (6 files),
   `pages/certifications/track.html`, `virtual-internship.html`,
   `pages/certifications/courses/technical.html`, `soft-skills.html`. Normalize header DOM to
   match `index.html` (CTA inside `.site-header__actions`).
2. **Remove the custom cursor entirely** (recommended; fixes the invisible-cursor bug at the root):
   delete `#cursor`/`#cursor-follower` divs on all pages, `.custom-cursor*` CSS, the
   `cursor: none` rule, and the cursor block in `site.js`.
3. **Write the missing CSS** (or rename classes in HTML to existing ones):
   - `.page-intro` — centered intro card, max-width ~880px, generous padding.
   - `.section__description` — match `.section__intro p`.
   - `.timeline__role` / `.timeline__bullets` — alias existing timeline h3 / ul styles.
   - `.hero__lead` — `font-size: 1.125rem; max-width: 54ch;`.
   - `.project-card` — inherits `.card`; hover lift `translateY(-4px)` + accent border
     (several are `<a>` wrappers).
   - `.project-card__image` — radius-sm, overflow hidden, `aspect-ratio: 16/10`,
     `img { width:100%; height:100%; object-fit: cover; }`, slight zoom on card hover. Add the
     CSS browser-chrome frame variant (`.project-card__image--framed`) used for screenshots (§3.1).
   - `.project-card__footer` — flex row, gap .5rem, accent, weight 600, `margin-top: auto`;
     arrow translates 4px on hover.
   - `.mosaic` — grid `repeat(auto-fit, minmax(300px, 1fr))`, gap clamp.
   - `.mosaic__item` — card tokens; img cropped 16/10, radius-sm.
   - `.hobby__label` — eyebrow-style small label.
4. **Replace invalid icons** in the two course pages: `fa-sigma` → `fa-square-root-alt`,
   `fa-presentation` → `fa-chalkboard-teacher`. Then verify EVERY `fa-*` class used site-wide
   exists in `assets/css/fontawesome-all.min.css` (FA 5.15.4 Free) via grep.
5. **Unify script loading** across all 15 pages (final stack defined in Phase 5).

### Phase 1 — Design system (`theme.css` overhaul)

1. Replace `:root` tokens:
   ```css
   --bg: #07090f;
   --surface-1: #0d1119;      /* opaque — stop stacking translucent layers */
   --surface-2: #131826;
   --border: rgba(148, 163, 184, 0.14);
   --border-strong: rgba(148, 163, 184, 0.28);
   --text: #eef2f8;
   --muted: #9aa5b5;
   --accent: #2ee6c8;
   --accent-strong: #5ff0d8;
   --accent-2: #b07ff5;
   --radius-sm: 8px;  --radius-md: 14px;  --radius-lg: 20px;
   --shadow-1: 0 4px 14px rgba(0,0,0,.3);
   --shadow-2: 0 12px 32px rgba(0,0,0,.4);
   ```
   Body background: `var(--bg)` +
   `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(46,230,200,.08), transparent)`.
2. **Merge the card zoo**: one `.card` base (surface-1, border, radius-md,
   padding `clamp(1.4rem, 2vw, 1.9rem)`, shadow-1); story/case/stack/cert become modifiers only
   where genuinely different. One icon-tile spec: 48px, radius 12px, accent @ 12% bg.
3. **Merge chip/tag/pill** into `.chip` (padding .3rem .85rem, border, pill radius, .82rem).
4. **Buttons**: merge ghost/outline; sentence case, no letter-spacing, .95rem, padding
   .8rem 1.6rem. Primary = solid accent, dark text (no gradient, no glow). Hover: 2px lift +
   brightness. Add a subtle sheen sweep on primary hover (pure CSS, ~600ms).
5. **Header**: keep floating pill; `rgba(10,13,20,.8)`, blur 16px, NO glow, thin border; add
   scrolled state via JS class. `aria-current="page"` styling (persistent underline); add
   "Home" to index nav.
6. **Focus & selection**: `:focus-visible` 2px accent outline offset 3px everywhere;
   accent-tinted `::selection`.
7. **Section rhythm**: `clamp(4rem, 8vw, 6.5rem)` vertical; `.section__intro` margin-bottom 3rem,
   intro paragraphs `max-width: 65ch`. Remove per-section radial backgrounds; alternate `--bg`
   with a slightly lighter band `#0a0d15`.
8. Replace inline `style="justify-content: center"` with `.btn-row--center` utility.

### Phase 2 — Content sync from CV (§2 is the spec)

1. **Homepage hero copy**: eyebrow → `Data Analyst · Cairo, Egypt` (drop ✨ + "Orbiting…").
   H1 stays the brand name; subtitle `Data Analyst — Power BI · Tableau · SQL · Python · Excel`.
   Lead = quantified positioning from §2. Chips = the 5 core tools.
2. **Homepage timeline** → the 4 CV entries with CV bullets (§2 Experience), newest first.
   `career.html` timeline updated to the same data (it keeps the longer bullets + the
   "Beyond the resume" cards).
3. **Projects everywhere**: add the **CoE Reporting Suite** as flagship #1 on index featured grid,
   `projects.html` featured, and `pages/projects/excel.html` (full case-study card: Challenge /
   Actions / Impact from §2, with metric chips `250K calls · 3 yrs · –60% reporting time`).
   Fix the YouTube project description on index to Power BI (+ Python/SQL prep). Add "35,000+
   students" to Customer Engagement copy.
4. **Certifications pages**: cert lists per §2 incl. Power BI Developer (2026) and British
   Airways (2025); add years to all cert cards.
5. **Skills/toolkit sections**: align to §2 skills; drop/demote R and scikit-learn claims; add
   GenAI/RAG/LLMs line under Programming & AI; add Jira/Slack to collaboration card.
6. **Contact everywhere**: primary buttons = `Email me` (`mailto:ahmed@ahmedhindy.com`) +
   `Connect on LinkedIn`; secondary = GitHub, 365DS. Footer gets an email icon link too.
7. **CV download**:
   - Convert `Ahmed_Amin_CV_DataAnalyst.docx` → `assets/cv/Ahmed_Amin_CV_DataAnalyst.pdf`.
     On this machine use Word COM via PowerShell:
     ```powershell
     $w = New-Object -ComObject Word.Application; $w.Visible = $false
     $d = $w.Documents.Open("c:\Users\PC\Desktop\Portfolio\Ahmed_Amin_CV_DataAnalyst.docx")
     $d.SaveAs([ref]"c:\Users\PC\Desktop\Portfolio\assets\cv\Ahmed_Amin_CV_DataAnalyst.pdf", [ref]17)
     $d.Close(); $w.Quit()
     ```
     If Word isn't installed, leave the button wired to the path and tell Ahmed to export the PDF
     there manually.
   - Buttons: header CTA becomes **"Download CV"** (`.btn--primary`, `download` attribute) — it's
     the #1 recruiter action; "Let's connect" moves into the contact section. Hero also gets a
     Download CV secondary button.
   - **Move/keep the .docx out of the deployed site**: once the PDF exists, delete the docx from
     the repo root (it would be publicly downloadable on GitHub Pages) — flag to Ahmed before
     deleting; at minimum ship only the PDF.

### Phase 3 — Page-level redesign

**Homepage**
1. Hero two-column. Left: eyebrow, h1, lead, chips, CTAs (`View projects` primary ·
   `Download CV` outline). Right: portrait panel (keep) + **replace the "Latest obsession" stat
   card and the three `hero__label` boxes with the live KPI panel** (§ Phase 4.1).
2. Mobile hero order: copy first (remove `order: -1` on `.hero__visual`).
3. Featured projects: 2-col grid, real screenshots via `.project-card__image--framed`
   (CoE/callCenter jpeg, customerEngagement png, youtubeTop1000 jpeg, eLearning jpeg), each with
   1–2 metric chips. CoE first.
4. Copy pass: remove "100% obsessed with decisions", "measurable data adventures"-type lines;
   quantified, plain-spoken voice per CV.

**Projects hub (`pages/projects.html`)**
5. Category cards: add project counts; keep icons. Featured cards get framed screenshots +
   metric chips. Add the filterable grid (§ Phase 4.3).

**Tech pages (`pages/projects/*.html`)**
6. Case-study cards keep Challenge/Actions/Impact but `h4` becomes small accent eyebrows;
   screenshots framed + click-to-enlarge (lightbox, § Phase 4.5). Excel page gains the CoE
   flagship case study.

**Certifications (`pages/certifications*.html`)**
7. **Display the actual certificates**: on `track.html`, `virtual-internship.html`, and both
   course pages, add a thumbnail grid (`.cert-gallery`): scan thumbnail (16/10 crop, framed) +
   provider + title + year, click opens lightbox. Map files from `images/Certificates/
   track-certificates/`, `virtual-internships/`, `course-certificates/`. Dedupe first: delete
   `images/Certificates/top-certificates/` and reference canonical copies. Compress
   `Bloomberg.png` (1.1 MB → <200 KB @ ~1600px) and any file >200 KB.

**Career (`pages/career.html`)**
8. Company/university logo tiles (`images/Career/*.png|jpg`, 40px rounded on surface-2) beside
   each timeline entry; compress `asu.png`. Timeline data per §2.

**Hobbies (`pages/hobbies.html`)**
9. Mosaic styled (Phase 0.3); chess card shows **1700+ / top 2%** as a big tabular-nums stat.

**Navigation (all pages)**
10. Same nav order everywhere incl. Home; `aria-current="page"` on every page; breadcrumb strip
    on level-3 pages ("Projects / Tableau").

### Phase 4 — Signature "wow" features (the shock layer — tasteful, all on-brand)

Ordered by impact; all must respect `prefers-reduced-motion` (reduced = final state, no animation).

1. **Hero live KPI panel** (replaces static stat card): a small dashboard-styled panel over the
   hero visual — 3–4 KPI tiles (`–60% reporting time`, `+30% performance`, `250K calls`,
   `10 mo top streak`) with count-up numbers on load, tabular nums, tiny sparkline SVGs. The
   message: *the portfolio itself is a dashboard.* Pure HTML/CSS/vanilla JS.
2. **Stat band on homepage** (below hero or above contact): 4 count-up stats from §2 headline
   numbers, triggered once via IntersectionObserver.
3. **Filterable project grid** on `projects.html`: chip filters (All / Tableau / Power BI /
   Excel / Python / SQL); vanilla JS show/hide with a 200ms FLIP-ish fade/translate. No library.
4. **Embedded interactive Tableau dashboard** on `pages/projects/tableau.html`: click-to-load
   facade (static screenshot + play button; on click, inject the Tableau Public embed iframe for
   the E-Learning dashboard). Recruiters interact without leaving the site; facade protects
   page-load performance.
5. **Certificate/screenshot lightbox**: one shared ~40-line vanilla JS lightbox (dialog element,
   Esc/arrow keys, focus trap, `loading="lazy"` full images).
6. **Scroll progress bar**: 2px accent line fixed at viewport top (`transform: scaleX`), pure
   JS/CSS, ~10 lines.
7. **Card micro-interactions**: hover lift + border-accent + screenshot zoom (already in Phase 0/1
   specs); optional subtle 2° tilt via CSS `perspective` on featured cards only.
8. **Custom OG/social card** (1200×630): dark bg, gridline motif, name + "Data Analyst", accent
   rule, 2–3 KPI numbers. Build as HTML/SVG and screenshot/export to `images/og-card.png`. This is
   what recruiters see when the link is shared in LinkedIn/Slack — first-impression shock before
   they even click.

Explicitly rejected (keeps the site senior): AI-generated project imagery (§3), preloader,
custom cursor, autoplaying carousels, tilt-everything, chatbots.

### Phase 5 — Motion & performance

1. **Delete the preloader** on all pages (a static site must not fake a 2 s load). Optional 300ms
   body fade-in.
2. **Delete the custom cursor** (done in Phase 0.2).
3. **Drop Lenis** — native scrolling + CSS `scroll-behavior: smooth` for anchors.
4. **Drop Three.js** (~600 KB) → vanilla `<canvas>` 2D particle network (~60 lines): ≤60
   particles, pause via IntersectionObserver + `visibilitychange`, disabled under
   `prefers-reduced-motion` and <960px. Same visual, ~0.4% of the payload. It sits BEHIND the
   hero KPI panel (§4.1) as texture, opacity ~0.5.
5. **Drop GSAP/ScrollTrigger** → IntersectionObserver + CSS reveals (`.reveal` → `.is-visible`,
   24px translate + fade, stagger via `transition-delay` on children). Media query zeroes all
   transitions under reduced-motion. **Net: zero JS libraries**; one `site.js` ≤ ~8 KB covering
   nav, reveals, count-ups, filter, lightbox, canvas, scroll bar, Tableau facade.
6. **Images**: `width`/`height` attributes everywhere; `loading="lazy"` below the fold; compress
   all files >200 KB (Bloomberg, asu, etc.); consider WebP for big screenshots.
7. **Delete dead weight** (verified unreferenced): `assets/css/main.css`, `noscript.css`,
   `assets/js/jquery.min.js`, `main.js`, `util.js`, `breakpoints.min.js`, `browser.min.js`,
   `jquery.scrollex.min.js`, `jquery.scrolly.min.js`, `assets/sass/`, `images/pic01–11.jpg`,
   `images/banner.jpg`, `images/Certificates/top-certificates/`, `images/Projects/Top Projects/`,
   HTML5UP `README.txt` (replace with a real README), `LICENSE.txt` once no template code remains.
   Re-verify zero references with grep before each deletion.

### Phase 6 — SEO, meta, resilience

1. Per-page canonical + OG (`og:title/description/image/url/type`) + Twitter card meta, using
   `images/og-card.png` (§4.8).
2. JSON-LD `Person` on index: name (per branding decision §2), jobTitle "Data Analyst", sameAs:
   LinkedIn, GitHub, Tableau Public, LeetCode, Chess.com, 365DS.
3. `sitemap.xml` (15 URLs), `robots.txt`, `404.html` in site theme.
4. Skip-to-content link + `id="main"` on `<main>` everywhere.
5. Mobile nav: close on Escape; hamburger ↔ X swap on `[aria-expanded="true"]`; focus returns to
   toggle on close.
6. Favicon set: keep `ahmedhindy.png`; add 180×180 `apple-touch-icon`.
7. Page titles pattern: `Ahmed Hindy — Data Analyst` (index),
   `<Page> · Ahmed Hindy` (subpages); meta descriptions rewritten with §2 positioning.

---

## 10. Verification checklist (run after implementation)

- Open all 15 pages locally (e.g. `python -m http.server`): styled pill header, visible cursor,
  consistent nav + breadcrumbs, no blank icons, no unstyled blocks, footer email link works.
- Grep gates → zero hits: `site-header__inner`, `fa-sigma`, `fa-presentation`, `main.css`,
  `jquery`, `lenis`, `gsap`, `three.min.js`, `preloader`, `custom-cursor`, `style="justify`.
- Class audit: every `class="…"` token used in HTML exists in `theme.css` (rerun the extraction
  script from the review).
- CV: `assets/cv/Ahmed_Amin_CV_DataAnalyst.pdf` exists, opens, and both Download buttons fetch it.
- Content: timeline titles/dates match §2 exactly on index AND career page; CoE project present
  in 3 places; email is `ahmed@ahmedhindy.com` everywhere; **no phone number anywhere in HTML**.
- Lighthouse (index + tableau.html + track.html): Performance ≥ 90 mobile, A11y ≥ 95, SEO ≥ 95,
  CLS ≈ 0.
- `prefers-reduced-motion: reduce` emulation: no animations, all content visible, count-ups show
  final values.
- Keyboard-only: tab order, visible focus, Escape closes mobile nav AND lightbox, lightbox focus
  trap works, Tableau facade activates with Enter.
- Viewports 375 / 768 / 1440 on index, projects.html, tableau.html, hobbies.html,
  certifications/track.html.
- Total transferred payload on index < 1 MB (excluding the Tableau embed, which is click-gated).

## 11. Open items for Ahmed (non-blocking — implement with defaults, surface at the end)

1. **Name branding**: site says "Ahmed Hindy", CV says "Ahmed Amin" (§2 flag). Default: keep
   "Ahmed Hindy" on the site. Confirm or switch.
2. Confirm deleting the `.docx` from the repo after PDF conversion (it's publicly served
   otherwise).
3. Confirm dropping R / scikit-learn claims from the toolkit section (CV doesn't back them).
4. Unbounded stays as display font (restricted per §4.3) — confirm, or go all-Space Grotesk.
