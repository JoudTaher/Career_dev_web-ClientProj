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

`images/placeholder.svg` is used until approved U-M photographs are selected. Each image has a nearby HTML comment describing the intended photograph. `images/umsi-logo-placeholder.svg` marks where the approved official UMSI logo should be added. Replace each placeholder and review its alt text so it accurately describes the final asset.

## Publishing

The site uses static HTML, CSS, and JavaScript and can be published directly with GitHub Pages. If the repository name changes, update the `<base>` path in `404.html`.
