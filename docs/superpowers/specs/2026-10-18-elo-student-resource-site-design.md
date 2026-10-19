# ELO Student Resource Site Design

## Purpose

Create a proof-of-concept website for the UMSI Engaged Learning Office (ELO) that helps undergraduate and graduate students understand engaged-learning opportunities and find useful support at the right point in an experience. Faculty and staff may also use the public resources, but student needs and language take priority.

The site must feel like a guided learning resource, not a collection of unrelated links. It will provide two clear ways to begin: students may identify the course or program they are participating in, or identify their current stage in the engaged-learning lifecycle. Both paths will lead to the same central resource library so worksheets, guides, and checklists are not duplicated.

## Scope

The proof of concept will contain five static pages:

1. `index.html` — ELO introduction and two primary choices: find an experience or find a stage.
2. `experiences.html` — representative courses, programs, and other experience types, with official UMSI links.
3. `journey.html` — all five lifecycle stages: Preparing, Starting, During, Ending, and After.
4. `resources.html` — the single canonical library for representative ELO materials, with simple accessible filters.
5. `404.html` — a useful recovery page linking to the three main subject areas.

This satisfies the assignment requirement for a homepage, at least three subject pages, and a 404 page. The proof of concept will demonstrate representative content rather than reproduce every ELO course, program, and resource. Its structure will make future additions straightforward.

## Site Requirements

The same public website will work across smartphones, tablets, laptops, and desktop computers. Every supported device will provide the same information and core functionality; responsive layouts may rearrange content, but they will not hide or remove it.

All text, images, videos, hyperlinks, and lists will remain readable, operable, and available at every supported screen size. In particular:

- Text will reflow without horizontal page scrolling.
- Images will scale within their containers and preserve useful alternative text.
- Videos, when available, will use responsive containers, visible playback controls, no autoplay, and captions or a clearly identified transcript.
- Hyperlinks will remain descriptive, keyboard accessible, and large enough to activate comfortably.
- Ordered and unordered lists will retain semantic HTML and readable spacing.

The finished site will be suitable for public deployment with GitHub Pages. It will not depend on authentication, private files, server-side code, or device-specific functionality.

## Technical Approach

The site will use plain HTML5, CSS3, and JavaScript so it can be hosted publicly and directly on GitHub Pages.

- Every page will be a standalone HTML file with consistent header, navigation, and footer markup.
- `css/style.css` will contain mobile-first presentation rules and larger-screen enhancements.
- `js/script.js` will contain the accessible mobile navigation, resource filters, and automatic footer year.
- `images/placeholder.svg` will remain a neutral local placeholder. Each meaningful `<img>` will include page-specific draft alt text and a nearby comment describing the intended approved U-M photograph.
- Resource filtering will use native buttons, `data-*` attributes, and the HTML `hidden` attribute. No framework or third-party library is required.
- No client-side routing, content-management system, CSS preprocessor, external font service, or build step will be introduced.

Repeated header and footer markup is acceptable for this small static assignment. Avoiding a templating system keeps the project readable to an introductory web-development audience and compatible with GitHub Pages.

## Information Architecture

The primary navigation on every page will be:

- Home
- Experiences
- Journey
- Resource Library

### Home

The homepage will briefly explain engaged learning and ELO support. Its main actions will be two prominent links:

- “Find your experience” links to `experiences.html`.
- “Find your stage” links to `journey.html`.

A secondary “Browse all resources” link will serve visitors who already know what they need. Supporting content will show the breadth of ELO support without duplicating the detailed material from the subject pages.

### Experiences

The Experiences page answers “What am I doing?” It will group representative opportunities into:

- Client-based courses.
- ELO programs and community engagement.
- Global experiences.
- Research.
- Entrepreneurship and start-up development.
- Other applied learning.

Course and program information will be based on the official UMSI pages. Each entry will contain only what belongs to the experience itself: a concise description, intended audience or participation context when known, an official source or application link, and a link to the lifecycle. It will not repeat full worksheets or stage guidance.

The page will feature examples from the current official listings, such as client-based SI courses and programs including AI Clinic, SO-ELL, Alternative Spring Break, Alternative Fall Break, A2 Data Dive, and UMSI Service Day. It will also link to the official complete listings because offerings, eligibility, and application details may change.

### Journey

The Journey page answers “Where am I in it?” A short stage navigation at the top will link to five sections on the same page:

1. Preparing — goals, expectations, partner and community preparation, cultural awareness, and skill readiness.
2. Starting — relationships, roles, team plans, project expectations, and communication practices.
3. During — project and team management, partner communication, conflict, ethical engagement, feedback, and reflection.
4. Ending — final deliverables, transition and handoff, communicating results, closing relationships, evaluation, and reflection.
5. After — articulating learning, resumes and portfolios, professional relationships, and applying learning in the future.

Each section will include a short explanation, a focused checklist, a reflection prompt, and links to relevant canonical resources. Keeping the five stages on one page provides the complete lifecycle without adding unnecessary pages.

### Resource Library

The Resource Library is the only place where the representative resources are fully listed. Resources will cover the formats named in the brief: templates and worksheets, guides, checklists, videos, learning modules, trainings or workshops, reflection activities, examples, and other tools.

Each resource will be an `<article>` with a stable fragment identifier such as `resources.html#navigating-conflict`. Experience and Journey pages will link to that identifier instead of reproducing the resource description.

The library will provide accessible filter buttons for stage, experience, and resource type. Filters will:

- Use real `<button>` elements.
- Expose their selected state with `aria-pressed`.
- Keep all resources available when JavaScript is unavailable.
- Announce the number of visible results in a polite live region.
- Provide an obvious “Show all” option.
- Never make color the only indication of selection.

The proof of concept may link to an official external document or describe a proposed ELO resource when the actual material is not publicly available. Proposed resources will be labeled honestly rather than presented as official downloads.

### 404 Page

The 404 page will explain the error in plain language and provide links to Home, Experiences, Journey, and the Resource Library. Its base URL behavior will continue to support nested missing routes on GitHub Pages.

## Content Ownership and Non-Duplication

Each content type has one responsibility:

- Experiences owns descriptions of opportunities and how to learn more or join.
- Journey owns stage-specific guidance and next actions.
- Resource Library owns resource descriptions and destinations.

For example, “Navigating conflict” appears as one resource at `resources.html#navigating-conflict`. The During section and relevant experience content may both link to it, but neither will repeat the full resource description. This pattern allows new courses, stages, and resources to be added without rewriting existing material.

## Content Sources

Content will be concise and based on:

- The complete assignment brief supplied by the user.
- The official UMSI engaged-learning, ELO, client-based courses, and engaged-learning programs pages.
- The linked ELO Content Document if its text becomes publicly readable.

The ELO Content Document currently redirects to Google sign-in in the available browser. The proof of concept can be built from the supplied brief and public UMSI pages, but inaccessible document-specific wording or downloads will not be invented. External links will be clearly identified and current official pages will remain the source of truth for changing program details.

## Visual Design and Responsive Behavior

The design will be modern but restrained and consistent with U-M brand guidance:

- Michigan Blue (`#00274c`) as the primary color.
- Michigan Maize (`#ffcb05`) as an accent, paired with sufficiently dark text.
- White and light neutral backgrounds for readability.
- System fonts for dependable rendering and fast loading.
- Clear visual hierarchy, generous spacing, simple cards, and limited decorative effects.
- No autoplay, carousels, parallax, flashing content, or motion-heavy interactions.

The default layout will target small mobile screens. Content will use flexible widths, fluid type where appropriate, and single-column cards. Media queries will add horizontal navigation and multi-column layouts for tablets and desktops without removing content or functionality.

Responsive verification will cover representative smartphone, tablet, laptop, and desktop widths. Layout changes will affect presentation only; text, images, video resources, hyperlinks, lists, navigation, and filtering will remain available at every width.

Final photographs will use intrinsic width and height, `max-width: 100%`, and responsive image markup such as `srcset` and `sizes` where multiple approved image sizes are available. The placeholders cannot provide multiple real crops, but the markup and comments will identify what is needed when final assets are selected.

## Image Placeholders

All photographs will remain placeholders so approved images can later be selected from U-M resources.

- Meaningful images will use descriptive draft alt text that explains the intended photograph in its page context.
- Every placeholder will have a code comment such as `Replace with an approved U-M image of ...`.
- Decorative images, if any, will use `alt=""` so assistive technology ignores them.
- Width, height, and CSS aspect-ratio rules will reserve space and reduce layout shifts.
- Alt text must be reviewed when the final image is selected so it describes the actual image.

No third-party, AI-generated, or unlicensed photographs will be added.

## Accessibility Requirements

The implementation will target WCAG 2.2 AA practices and common WAVE and Axe checks:

- A visible-on-focus skip link on every page.
- Semantic `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` elements where appropriate.
- One descriptive `h1` per page and a logical heading hierarchy.
- Keyboard-operable navigation and filters using native controls.
- Correct `aria-expanded`, `aria-controls`, `aria-current`, and `aria-pressed` states.
- Clearly visible focus indicators and sufficiently large controls.
- Sufficient text and interactive-element color contrast.
- Descriptive link text and visible notice when links open new tabs.
- Images with appropriate alt attributes and explicit dimensions.
- Captions and transcripts identified for video resources.
- Responsive video containers with user-controlled playback and no autoplay.
- No information conveyed by color alone.
- Content that remains usable at high zoom without two-dimensional page scrolling.
- Reduced-motion and forced-color considerations.
- Progressive enhancement so navigation and resources remain available when JavaScript fails.

Automated validators cannot prove full accessibility. The finished implementation must also receive keyboard, zoom, responsive, and screen-reader-oriented manual checks.

## JavaScript Behavior

JavaScript will remain small and defensive:

- Toggle the mobile navigation and synchronize `aria-expanded`.
- Close the mobile navigation when a link is selected or Escape is pressed.
- Restore the desktop navigation state when the viewport becomes wide.
- Filter resource cards by one selected value in each filter group.
- Synchronize `aria-pressed` for filter controls.
- Update a polite live-region result count after filtering.
- Insert the current year into the footer.

The page will initially show every resource. If the script fails, all resources remain visible and usable.

## Verification

Automated tests will use built-in Node.js functionality and verify:

- All five required pages exist.
- Every page has a unique title, language, skip link, main landmark, consistent navigation, and footer.
- Each page contains exactly one `h1` and logical landmark structure.
- Images have alt attributes and explicit dimensions.
- Internal links and resource fragment targets exist.
- Navigation identifies the current page.
- The lifecycle contains all five named stages.
- The Experiences page contains both courses and programs.
- Every cross-page resource link resolves to one canonical library entry.
- Resource filter controls and script expose accessible state and a no-JavaScript fallback.
- Mobile, tablet, and desktop responsive rules exist.

After automated checks pass, the site will be served locally and reviewed at representative smartphone (320–390px), tablet (768px), laptop (1024px), and desktop (1440px or wider) widths. Manual checks will include content parity, keyboard navigation, filter behavior, focus order and visibility, menu state, high zoom, page overflow, image and video scaling, disabled JavaScript, and browser console errors. Axe or WAVE results will be run when the environment provides those browser tools; any unavailable audit will be reported rather than claimed.

## Non-Goals

- Reproducing every page or resource on the full UMSI website.
- Creating a separate page for every current course or program.
- Inventing unavailable ELO documents or application details.
- Building a content-management system, authentication, analytics, search, or saved progress.
- Downloading final photography or creating an unofficial U-M logo.
- Adding framework complexity beyond the proof-of-concept requirements.
