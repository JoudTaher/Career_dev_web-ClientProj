# UMSI ELO Resource Hub

## Purpose

This proof-of-concept helps UMSI students understand engaged learning opportunities and find support at the right stage of an experience. It is a guided resource, not a copy of the full UMSI website.

## Structure

- `index.html`: two entry points—find an experience or find a stage.
- `experiences.html`: representative ELO courses, programs, and other experience types.
- `journey.html`: Preparing, Starting, During, Ending, and After.
- `resources.html`: the canonical Resource Library with filters.
- `404.html`: recovery links for missing pages.

## Content model

Experiences explains what an opportunity is and links to current official UMSI information. Journey provides guidance for each lifecycle stage. Resource Library contains each worksheet, template, guide, checklist, video placeholder, reflection, or example once. Other pages link to its stable resource anchors instead of duplicating material.

The site contains representative proof-of-concept resources. Official UMSI pages remain the source of truth for current courses, programs, eligibility, dates, and applications.

## Accessibility

The site uses semantic landmarks, logical headings, skip links, visible keyboard focus, descriptive links, descriptive placeholder alt text, native buttons, `aria-current`, `aria-expanded`, `aria-pressed`, a filter result live region, reduced-motion support, and forced-colors support. Content and resources remain available without JavaScript.

Automated project tests support accessibility checks but do not replace WAVE, Axe, keyboard, zoom, and screen-reader testing.

## Responsive design

CSS is mobile first. Layouts expand at tablet, laptop, and desktop widths without removing content. Images include intrinsic dimensions and scale within their containers. The video placeholder reserves a responsive 16:9 area; a final video must include captions and a transcript.

## Desktop deliverable

The official second-view target is `64rem` (1024px). Mobile remains the default layout, and every responsive media query uses `min-width`.

- Home separates the introductory choice from two side-by-side route cards.
- Experiences presents course and program cards in three-column groups.
- Journey keeps the five-stage navigation available while actions and reflection prompts use the wider screen side by side.
- Resource Library separates its filter explanation from the three filter groups and displays results in three columns.
- The designed 404 page separates the error code from two-column recovery links.
- Shared desktop navigation remains visible, and the footer uses a two-column information layout on every page.

The accessible Resource Library filters are the unique addition for this deliverable. The JavaScript combines stage, experience, and resource-type choices, keeps `aria-pressed` synchronized, and announces the number of matching resources through a live region. Without JavaScript, every resource remains available. JavaScript also writes the current year in every footer.

### Submission evidence checklist

Before submitting the desktop writeup, capture separate results for Home, Experiences, Journey, Resource Library, and 404:

- WAVE screenshot for each page.
- Axe screenshot for each page with Best Practices enabled.
- HTML validator result for each page with no errors.
- Keyboard, 200% zoom, horizontal-overflow, and browser-console checks.

Automated project tests do not replace these browser-validator screenshots. Do not report a validator as passed unless its result has been captured for every page.

## Running locally

From this folder:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Tests

```bash
npm test
```

Tests cover page structure, internal files and fragments, canonical resources, image attributes, navigation behavior, accessible filters, responsive rules, and the GitHub Pages 404 base path.

## Images

The project uses local UMSI photographs and a UMSI signature asset from the `images` directory. If an image is replaced with a selection from the UMSI Digital Asset Portal, review its alt text so it describes the final image in that page's context.

## Publishing

The site uses static HTML, CSS, and JavaScript and can be published directly with GitHub Pages. If the repository name changes, update the `<base>` path in `404.html`.
