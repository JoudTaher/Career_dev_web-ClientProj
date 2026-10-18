# ELO Student Resource Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a simple, accessible, mobile-first five-page ELO student resource website that can be hosted directly on GitHub Pages.

**Architecture:** Five standalone HTML pages share one stylesheet, one small progressive-enhancement script, and one local image placeholder. A built-in Node.js test suite checks required structure, links, accessibility attributes, styles, and menu behavior without external packages.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner

**Spec:** `docs/superpowers/specs/2026-10-18-elo-student-resource-site-design.md`

## Global Constraints

- Use plain HTML5, CSS3, and JavaScript with no frameworks, dependencies, external fonts, or build step.
- Create exactly the required Home, Preparing, Starting, During, and 404 pages.
- Use U-M blue `#00274c` and maize `#ffcb05` with accessible contrast.
- Keep all content and functions available across phone, tablet, laptop, and desktop widths.
- Use only the local placeholder image with page-specific draft alt text and replacement comments.
- Target WCAG 2.2 AA practices and common WAVE/Axe checks.
- Keep content available when JavaScript is unavailable.

## Review Focus

- Missing or mistyped local links must fail the structure test instead of producing silent 404s.
- An image without alt text or intrinsic dimensions must fail the accessibility test.
- The mobile menu must keep `aria-expanded`, the hidden state, and visual state synchronized.
- Resizing from a narrow open menu to desktop and back must not leave navigation trapped in an incorrect state.
- Long text and 200% zoom must wrap without horizontal page scrolling.

---

### Task 1: Semantic Pages and Site Structure

**Files:**
- Create: `tests/site-structure.test.js`
- Create: `package.json`
- Create: `index.html`
- Create: `preparing.html`
- Create: `starting.html`
- Create: `during.html`
- Create: `404.html`
- Create: `images/placeholder.svg`

**Interfaces:**
- Consumes: Page scope, content pattern, accessibility rules, and image policy from the design specification.
- Produces: Five linked HTML documents using `css/style.css`, `js/script.js`, and `images/placeholder.svg`.

- [ ] **Step 1: Write the failing structure tests**

Add Node tests named `creates all five required pages`, `provides accessible shared page structure`, `uses unique titles and one h1 per page`, `provides accessible image placeholders`, `marks the current navigation item`, and `resolves every local page link`.

- [ ] **Step 2: Run the structure tests and verify the missing pages fail**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because the five HTML files do not exist.

- [ ] **Step 3: Implement the semantic pages and placeholder**

Create the five pages with shared skip link, header, navigation, main landmark, stage-specific content, footer, descriptive resource links, reflection prompts, and previous/next navigation. Add a neutral SVG placeholder and exact U-M image replacement comments.

- [ ] **Step 4: Run the structure tests and verify they pass**

Run: `node --test tests/site-structure.test.js`

Expected: all structure tests PASS.

- [ ] **Step 5: Commit the semantic site**

Run `git add package.json tests/site-structure.test.js index.html preparing.html starting.html during.html 404.html images/placeholder.svg`, then run `git commit -m "feat: add semantic ELO resource pages"`.

### Task 2: Mobile-First U-M Styling

**Files:**
- Modify: `tests/site-structure.test.js`
- Create: `css/style.css`

**Interfaces:**
- Consumes: Class names and landmarks from Task 1.
- Produces: Mobile-first responsive presentation with visible focus, high contrast, wrapping content, and tablet/desktop enhancements.

- [ ] **Step 1: Add failing style requirements**

Add tests named `loads the shared stylesheet`, `defines approved U-M colors`, `shows keyboard focus`, `supports reduced motion`, and `adds tablet and desktop responsive rules`.

- [ ] **Step 2: Run the style tests and verify the missing stylesheet fails**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because `css/style.css` does not exist.

- [ ] **Step 3: Implement the shared stylesheet**

Add mobile-first layout, skip-link behavior, accessible focus styles, readable typography, cards, checklists, reflection panels, image sizing, flexible navigation, and limited min-width media queries. Prevent overflow with flexible tracks and wrapping.

- [ ] **Step 4: Run the structure and style tests**

Run: `node --test tests/site-structure.test.js`

Expected: all tests PASS.

- [ ] **Step 5: Commit the responsive styling**

Run: `git add tests/site-structure.test.js css/style.css && git commit -m "feat: add accessible responsive styling"`

### Task 3: Accessible Navigation Behavior

**Files:**
- Create: `tests/script.test.js`
- Create: `js/script.js`

**Interfaces:**
- Consumes: `#menu-toggle`, `#primary-navigation`, `.site-nav__link`, and `[data-current-year]` elements from Task 1.
- Produces: `initializeSite(documentObject, windowObject)` for browser startup and direct Node testing.

- [ ] **Step 1: Write failing behavior tests**

Add tests named `opens and closes the mobile menu`, `closes the menu after navigation or Escape`, `resets navigation at the desktop breakpoint`, `writes the current footer year`, and `exits safely when optional elements are absent` using small DOM stubs.

- [ ] **Step 2: Run the behavior tests and verify the missing module fails**

Run: `node --test tests/script.test.js`

Expected: FAIL because `js/script.js` does not exist.

- [ ] **Step 3: Implement `initializeSite(documentObject, windowObject)`**

Synchronize the menu button's `aria-expanded` value with the navigation `hidden` state, close after link selection or Escape, restore desktop state at `min-width: 48rem`, and write the current year. Auto-initialize in the browser and export the function for Node tests.

- [ ] **Step 4: Run all automated tests**

Run: `node --test`

Expected: all structure, style, and behavior tests PASS with zero failures.

- [ ] **Step 5: Commit the progressive enhancement**

Run: `git add tests/script.test.js js/script.js && git commit -m "feat: add accessible mobile navigation"`

### Task 4: Browser and Accessibility Verification

**Files:**
- Modify only if verification exposes a defect in an existing site file.

**Interfaces:**
- Consumes: Complete static site from Tasks 1–3.
- Produces: Verified local site at phone, tablet, and desktop widths.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Serve the project locally**

Run: `python3 -m http.server 8000`

Expected: all five pages return successfully through the local server.

- [ ] **Step 3: Inspect representative responsive widths**

Check approximately 390px, 768px, and 1440px widths for readable wrapping, navigation behavior, image scaling, logical order, and no horizontal page overflow.

- [ ] **Step 4: Verify keyboard and browser behavior**

Use Tab, Shift+Tab, Enter, and Escape where applicable; confirm visible focus, skip-link movement, menu state, useful 404 navigation, and zero browser console errors.

- [ ] **Step 5: Re-run fresh final verification**

Run `npm test`, then `git diff --check`, then `git status --short`.

Expected: tests pass, no whitespace errors, and only intentional project changes remain.
