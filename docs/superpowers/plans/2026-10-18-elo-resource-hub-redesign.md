# ELO Resource Hub Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing proof of concept as a five-page, accessible, responsive ELO resource hub with two clear entry paths and one canonical resource library.

**Architecture:** Home routes students by experience or lifecycle stage. Experiences owns course and program descriptions, Journey owns the five stages, and Resource Library owns each resource exactly once; cross-page links target stable resource fragments. One stylesheet and one progressive-enhancement script serve every static page for direct GitHub Pages hosting.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner

**Spec:** `docs/superpowers/specs/2026-10-18-elo-student-resource-site-design.md`

## Global Constraints

- Use plain HTML5, CSS3, and JavaScript with no frameworks, dependencies, external fonts, or build step.
- Ship exactly `index.html`, `experiences.html`, `journey.html`, `resources.html`, and `404.html` as the public pages.
- Keep all text, images, video resources, hyperlinks, lists, navigation, and filters available at smartphone, tablet, laptop, and desktop widths.
- Use Michigan Blue `#00274c` and Michigan Maize `#ffcb05` with WCAG 2.2 AA-oriented contrast.
- Use only the local placeholder image with page-specific descriptive alt text and approved U-M replacement comments.
- Keep navigation and every resource available when JavaScript is unavailable.
- Label proposed resources honestly; do not invent unavailable official ELO downloads or application details.
- Keep the README factual, concise, and limited to the site purpose, architecture, accessibility, responsive behavior, local use, testing, and GitHub Pages publication.

## Review Focus

- A resource link with a missing or misspelled fragment must fail tests instead of silently landing at the top of the library.
- Combining stage, experience, and type filters must show only cards matching every active group and must announce the correct result count.
- Disabled JavaScript must leave navigation and the full resource library visible and usable.
- Content must reflow without horizontal page scrolling from 320px through 1440px and at high zoom.
- Official course and program links may change, so the page must distinguish stable explanatory copy from external current-detail links.

---

### Task 1: Canonical Five-Page Content Architecture

**Files:**
- Modify: `tests/site-structure.test.js`
- Modify: `index.html`
- Create: `experiences.html`
- Create: `journey.html`
- Create: `resources.html`
- Modify: `404.html`
- Delete: `preparing.html`
- Delete: `starting.html`
- Delete: `during.html`

**Interfaces:**
- Consumes: Approved page ownership and content-source rules from the specification.
- Produces: Five static pages with shared navigation and stable resource targets consumed by Tasks 2–4.

- [ ] **Step 1: Replace the old page expectations with failing architecture tests**

Add tests named `creates the canonical five-page site`, `keeps shared navigation consistent`, `provides two homepage entry paths`, `includes official courses and programs`, `includes all five lifecycle stages`, `resolves local files and resource fragments`, and `keeps every resource definition canonical`. Assert the exact public page list and stage IDs `preparing`, `starting`, `during`, `ending`, and `after`.

- [ ] **Step 2: Run the structure tests and verify the redesign fails**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because `experiences.html`, `journey.html`, and `resources.html` do not exist and the old navigation is still present.

- [ ] **Step 3: Implement the five semantic pages**

Rewrite Home with “Find your experience” and “Find your stage” primary actions. Add representative official course/program content to Experiences, all five lifecycle sections to Journey, canonical `<article id="..." data-resource>` entries to Resources, and four recovery links to 404. Every page must retain the skip link, labeled primary navigation, one `h1`, main landmark, footer, meaningful image placeholder, and descriptive external-link notices.

- [ ] **Step 4: Remove superseded stage files and run the structure tests**

Remove `preparing.html`, `starting.html`, and `during.html` after all links have moved to `journey.html#<stage>`. Run: `node --test tests/site-structure.test.js`

Expected: all structure tests PASS, including local file and fragment resolution.

- [ ] **Step 5: Commit the new architecture**

Run `git add tests/site-structure.test.js index.html experiences.html journey.html resources.html 404.html preparing.html starting.html during.html`, then `git commit -m "feat: restructure ELO resource hub"`.

### Task 2: Accessible Resource Filtering

**Files:**
- Modify: `tests/script.test.js`
- Modify: `js/script.js`
- Modify: `resources.html`

**Interfaces:**
- Consumes: `[data-resource-library]`, `[data-filter-group]`, `[data-filter-value]`, `[data-resource]`, and `[data-filter-status]` markup from Task 1.
- Produces: `initializeResourceFilters(documentObject)` and the existing `initializeSite(documentObject, windowObject)` browser entry point.

- [ ] **Step 1: Add failing filter behavior tests**

Add tests named `filters resources by one group`, `combines active filter groups`, `show all resets one group`, `updates aria-pressed and the live result count`, and `leaves the page safe when filter markup is absent`. Exercise unknown or empty data values so malformed cards remain hidden rather than causing an exception.

- [ ] **Step 2: Run the script tests and verify the missing filter behavior fails**

Run: `node --test tests/script.test.js`

Expected: FAIL because `initializeResourceFilters` is not exported.

- [ ] **Step 3: Implement `initializeResourceFilters(documentObject)`**

Maintain one active value per `data-filter-group`; treat `all` as the group wildcard. A card is visible only when its whitespace-separated `data-<group>` values match every non-`all` selection. Synchronize button `aria-pressed`, set card `hidden`, and write “Showing N resources.” to the polite status region. Do nothing safely when the library is absent.

- [ ] **Step 4: Run all script tests**

Run: `node --test tests/script.test.js`

Expected: navigation, footer-year, and filter tests all PASS.

- [ ] **Step 5: Commit the progressive enhancement**

Run `git add tests/script.test.js js/script.js resources.html`, then `git commit -m "feat: add accessible resource filters"`.

### Task 3: Mobile-First Responsive Presentation

**Files:**
- Modify: `tests/site-structure.test.js`
- Modify: `css/style.css`
- Modify: `index.html`
- Modify: `experiences.html`
- Modify: `journey.html`
- Modify: `resources.html`

**Interfaces:**
- Consumes: Semantic classes and data attributes from Tasks 1–2.
- Produces: The same content and controls at 320–390px, 768px, 1024px, and 1440px or wider.

- [ ] **Step 1: Add failing responsive and accessibility style tests**

Add tests for responsive image dimensions, mobile-first single-column defaults, tablet/laptop/desktop media rules, visible focus, reduced motion, forced-colors support, filter selected-state styling beyond color, and flexible video containers. Assert no media rule hides required content.

- [ ] **Step 2: Run the structure tests and verify new style requirements fail**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL on the newly required layout and control selectors.

- [ ] **Step 3: Refactor the shared stylesheet**

Preserve the U-M palette and readable typography while styling the dual home choices, experience groups, sticky-safe stage links, lifecycle sections, filter fieldsets, canonical resource cards, responsive media, and 404 recovery. Use flexible grids, wrapping, intrinsic sizing, and min-width media queries without viewport-specific content removal.

- [ ] **Step 4: Run automated tests and inspect static output**

Run: `npm test`

Expected: all tests PASS. Then run `git diff --check`; expected: no whitespace errors.

- [ ] **Step 5: Commit the responsive redesign**

Run `git add tests/site-structure.test.js css/style.css index.html experiences.html journey.html resources.html`, then `git commit -m "feat: add responsive ELO hub presentation"`.

### Task 4: Concise Project README

**Files:**
- Create: `README.md`
- Modify: `tests/site-structure.test.js`

**Interfaces:**
- Consumes: Final page names, interaction behavior, and verification commands from Tasks 1–3.
- Produces: A short maintainer-facing description of the project without promotional copy.

- [ ] **Step 1: Add a failing README contract test**

Add a test named `documents the site without overstating scope` that requires `README.md` to name Experiences, Journey, Resource Library, accessibility, responsive behavior, `npm test`, and GitHub Pages, and rejects claims that the proof of concept contains every ELO resource.

- [ ] **Step 2: Run the README test and verify it fails**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because `README.md` does not exist.

- [ ] **Step 3: Write the concise README**

Use short sections for Purpose, Structure, Content Model, Accessibility, Responsive Design, Running Locally, Tests, Images, and Publishing. State that the public site is a representative proof of concept and that official UMSI pages remain the source of truth for changing offerings.

- [ ] **Step 4: Run tests and commit the documentation**

Run: `npm test`

Expected: all tests PASS. Then run `git add README.md tests/site-structure.test.js && git commit -m "docs: explain ELO resource hub"`.

### Task 5: Cross-Device and Accessibility Verification

**Files:**
- Modify only if verification exposes a defect in an existing project file.

**Interfaces:**
- Consumes: Complete site from Tasks 1–4.
- Produces: Evidence-backed final status and an identified list of any unavailable audits.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Serve every public page locally**

Run: `python3 -m http.server 8000`

Expected: Home, Experiences, Journey, Resource Library, and 404 return successfully with no browser console errors.

- [ ] **Step 3: Inspect representative device widths and high zoom**

Check 320px, 390px, 768px, 1024px, and 1440px widths plus 200% zoom. Confirm content parity, readable reflow, responsive images/media, usable navigation and filters, and no horizontal page overflow.

- [ ] **Step 4: Verify keyboard and progressive-enhancement behavior**

Use Tab, Shift+Tab, Enter, Space, and Escape. Confirm skip-link movement, visible focus, menu state, filter state and announcements, useful 404 recovery, and full content availability with JavaScript disabled.

- [ ] **Step 5: Run available accessibility checks and fresh final verification**

Run Axe or WAVE when the environment exposes either tool; record any unavailable audit without claiming it passed. Run `npm test`, `git diff --check`, and `git status --short` again. Expected: tests pass, no whitespace errors, and only intentional changes remain.

- [ ] **Step 6: Request a final independent review and address critical findings**

Ask a fresh reviewer to compare the completed branch with the approved specification, then fix any critical or important accessibility, navigation, content-ownership, or responsive defects before completion.
