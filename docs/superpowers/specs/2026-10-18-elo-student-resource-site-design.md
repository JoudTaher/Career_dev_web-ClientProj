# ELO Student Resource Site Design

## Purpose

Create a proof-of-concept website for the UMSI Engaged Learning Office (ELO) that helps students move through an engaged-learning experience. The site will guide students to timely actions and resources instead of acting as a large document repository.

The primary audience is UMSI undergraduate and graduate students. Faculty and staff may also use the public resources, but student needs and language take priority.

## Scope

The final site will contain five static pages:

1. `index.html` — overview of engaged learning and an entry point into the lifecycle.
2. `preparing.html` — goals, expectations, partner preparation, cultural awareness, and skill readiness.
3. `starting.html` — relationships, roles, project plans, expectations, and communication practices.
4. `during.html` — project and team management, partner communication, feedback, challenges, ethical engagement, and reflection.
5. `404.html` — a useful recovery page that directs visitors back to the homepage and lifecycle pages.

“During Your Experience” is the chosen subject page because it follows naturally from the two required lifecycle pages and covers the period when students most often need timely guidance.

## Technical Approach

The site will use plain HTML5, CSS3, and JavaScript so it can be hosted directly on GitHub Pages.

- Each page will be a standalone HTML file with the same header, navigation, and footer markup.
- `css/style.css` will contain all mobile-first presentation rules.
- `js/script.js` will contain only the accessible mobile-navigation behavior and automatic footer year.
- `images/placeholder.svg` will be a neutral local placeholder. Each `<img>` element will include page-specific draft alt text and a nearby code comment describing the intended U-M photograph.
- No frameworks, package dependencies, templating system, CSS preprocessors, external font services, or build step will be introduced.

Repeated header and footer markup is acceptable for this small static assignment. Avoiding a templating system keeps the code readable to an introductory web-development audience and compatible with GitHub Pages.

## Information Architecture

The primary navigation will follow the student journey:

- Home
- Preparing
- Starting
- During

The homepage will introduce ELO and present the lifecycle as a short sequence of choices. It will also identify the kinds of engaged-learning experiences supported by ELO, including client-based projects, community engagement, global experiences, research, and entrepreneurship.

Each lifecycle page will use the same content pattern:

1. A plain-language introduction explaining why the stage matters.
2. A short “At this stage” checklist.
3. Two or three focused guidance sections.
4. A small collection of clearly named resource links.
5. A reflection prompt.
6. Previous/next lifecycle navigation.

Resource links will explain what the visitor will receive rather than use generic phrases such as “click here” or “learn more.” Resources will not be duplicated unnecessarily across pages.

## Content Sources

Initial content will be concise and based on:

- The assignment brief supplied by the user.
- The official UMSI engaged-learning and ELO pages.
- The linked ELO Content Document when its text is available.

The ELO Content Document currently redirects to Google sign-in in the available browser. The site can still be built from the complete supplied brief and public UMSI material, but document-specific wording or resources cannot be represented faithfully until the document is shared in a readable form. The site will link to official resources and identify external links clearly.

## Visual Design

The design will be modern but restrained:

- U-M blue (`#00274c`) as the primary color.
- U-M maize (`#ffcb05`) as an accent, used with dark text.
- White and light neutral backgrounds for readability.
- System fonts for fast loading and dependable rendering.
- Generous spacing, clear headings, simple cards, and limited decorative effects.
- No auto-playing media, carousels, parallax, or motion-heavy interactions.

The site will be designed mobile-first. A compact single-column layout will be the default, with straightforward media queries adding wider navigation and multi-column card layouts for tablets and desktops. Content and functionality will remain the same at every viewport size.

## Image Placeholders

All photographs will remain placeholders so the user can later select appropriate images from U-M image resources.

- Meaningful placeholders will use `<img>` and descriptive draft alt text that describes the intended photograph and its purpose.
- Each image will include a source-code comment such as `Replace with an approved U-M image of ...`.
- Decorative imagery, if any, will use `alt=""`.
- Width, height, and CSS aspect-ratio rules will reserve space and prevent layout shifts.
- Alt text must be reviewed when final photographs are selected so it describes the actual image rather than only the original concept.

No third-party, AI-generated, or unlicensed photographs will be added.

## Accessibility Requirements

The implementation will target WCAG 2.2 AA practices and common WAVE/Axe checks:

- A visible-on-focus skip link on every page.
- Semantic `header`, `nav`, `main`, `section`, `aside`, and `footer` landmarks.
- One descriptive `h1` per page and a logical heading hierarchy.
- Keyboard-operable navigation with a real `<button>` for the mobile menu.
- Correct `aria-expanded` and `aria-controls` state on the menu button.
- `aria-current="page"` on the active navigation link.
- Clearly visible focus indicators.
- Sufficient text and interactive-element color contrast.
- Descriptive link text and an indication when a link opens an external site.
- Touch targets with adequate size and spacing.
- Images with appropriate alt attributes and explicit dimensions.
- No information conveyed by color alone.
- Usable content at zoomed text sizes without horizontal page scrolling.
- Reduced-motion support.
- JavaScript used as progressive enhancement; page content remains available if scripts fail.

## JavaScript Behavior

JavaScript will stay small and defensive:

- Toggle the mobile navigation and synchronize `aria-expanded`.
- Close the mobile navigation when a navigation link is selected.
- Restore the desktop navigation state when the viewport becomes wide.
- Insert the current year into the footer.

No client-side routing, resource database, filtering system, animation library, or form submission is needed.

## Verification

Automated tests will be written before site implementation and run with built-in Node.js functionality. They will verify:

- All five required pages exist.
- Every page has a unique title, language attribute, skip link, main landmark, shared navigation, and footer.
- Each page has exactly one `h1`.
- All images have an `alt` attribute and explicit dimensions.
- Internal page links point to files that exist.
- Each main navigation item has an active state on the relevant page.
- The mobile menu markup and script expose the required accessible state.

After automated checks pass, the site will be served locally and reviewed at representative phone, tablet, and desktop widths. Keyboard navigation, menu state, page overflow, image scaling, focus visibility, and browser console errors will be checked manually. Automated structure checks support but do not replace final WAVE or Axe testing in a browser.

## Non-Goals

- Reproducing the full UMSI website.
- Building all five lifecycle stages.
- Creating a content-management system.
- Adding authentication, analytics, search, or saved progress.
- Downloading final photography or creating an unofficial U-M logo.
- Adding features beyond the assignment requirements.
