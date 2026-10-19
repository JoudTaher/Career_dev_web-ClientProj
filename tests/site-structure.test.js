const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'experiences.html', 'journey.html', 'resources.html', '404.html'];
const contentPages = pages.slice(0, 4);
const legacyPages = ['preparing.html', 'starting.html', 'during.html'];
const navigationLinks = ['index.html', 'experiences.html', 'journey.html', 'resources.html'];

function read(fileName) {
  return fs.readFileSync(path.join(root, fileName), 'utf8');
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[1] ?? match[2]) : null;
}

function getTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
}

function getIds(html) {
  return new Set(getTags(html, '[a-z][a-z0-9-]*').map((tag) => getAttribute(tag, 'id')).filter(Boolean));
}

function assertCanonicalResourceLink(link, fileName, resourceIds) {
  const href = getAttribute(link, 'href');
  assert.match(href ?? '', /^resources\.html#[a-z0-9-]+$/, `${fileName} resource link needs one nonempty fragment`);
  const fragment = href.split('#')[1];
  assert.equal(resourceIds.has(fragment), true, `${fileName} resource link must target a canonical resource card`);
}

test('creates the canonical five-page site', () => {
  for (const fileName of pages) {
    assert.equal(fs.existsSync(path.join(root, fileName)), true, `${fileName} should exist`);
  }

  for (const fileName of legacyPages) {
    assert.equal(fs.existsSync(path.join(root, fileName)), false, `${fileName} should be replaced by journey.html`);
  }
});

test('provides accessible shared page structure', () => {
  for (const fileName of pages) {
    const html = read(fileName);
    assert.match(html, /<html[^>]+lang="en"/i, `${fileName} needs a language`);
    assert.match(html, /<meta[^>]+name="viewport"/i, `${fileName} needs a responsive viewport`);
    assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#main-content"/i, `${fileName} needs a skip link`);
    assert.match(html, /<header\b/i, `${fileName} needs a header landmark`);
    assert.match(html, /<nav[^>]+aria-label="Primary navigation"/i, `${fileName} needs labeled navigation`);
    assert.match(html, /<main[^>]+id="main-content"/i, `${fileName} needs the skip-link target`);
    assert.match(html, /<footer\b/i, `${fileName} needs a footer landmark`);
  }
});

test('keeps shared navigation consistent', () => {
  for (const fileName of pages) {
    const html = read(fileName);
    const navMatch = html.match(/<nav[^>]+aria-label="Primary navigation"[^>]*>([\s\S]*?)<\/nav>/i);
    assert.ok(navMatch, `${fileName} needs the primary navigation`);

    const hrefs = getTags(navMatch[1], 'a').map((tag) => getAttribute(tag, 'href'));
    assert.deepEqual(hrefs, navigationLinks, `${fileName} should use the same four navigation links`);
  }

  for (const fileName of contentPages) {
    const currentLinks = getTags(read(fileName), 'a').filter((tag) => getAttribute(tag, 'aria-current') === 'page');
    assert.equal(currentLinks.length, 1, `${fileName} needs one current-page link`);
    assert.equal(getAttribute(currentLinks[0], 'href'), fileName);
  }
});

test('uses unique titles and one h1 per page', () => {
  const titles = new Set();

  for (const fileName of pages) {
    const html = read(fileName);
    const title = html.match(/<title>([^<]+)<\/title>/i);
    assert.ok(title, `${fileName} needs a title`);
    assert.equal(titles.has(title[1]), false, `${fileName} title should be unique`);
    titles.add(title[1]);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${fileName} should contain one h1`);
  }
});

test('provides two homepage entry paths', () => {
  const html = read('index.html');
  assert.match(html, /href="experiences\.html"[^>]*>\s*Find your experience/i);
  assert.match(html, /href="journey\.html"[^>]*>\s*Find your stage/i);
  assert.match(html, /href="resources\.html"[^>]*>[^<]*Browse all resources/i);
});

test('includes official courses and programs', () => {
  const html = read('experiences.html');
  assert.match(html, /Client-based courses/i);
  assert.match(html, /SI 350/i);
  assert.match(html, /SI 485\/495/i);
  assert.match(html, /SI 487\/497/i);
  assert.match(html, /AI Clinic/i);
  assert.match(html, /SO-ELL/i);
  assert.match(html, /Alternative Spring Break/i);
  assert.match(html, /Alternative Fall Break/i);
  assert.match(html, /A2 Data Dive/i);
  assert.match(html, /UMSI Service Day/i);
  assert.match(html, /https:\/\/www\.si\.umich\.edu\/programs\/engaged-learning\/client-based-courses/i);
  assert.match(html, /https:\/\/www\.si\.umich\.edu\/programs\/engaged-learning\/engaged-learning-programs/i);
});

test('includes all five lifecycle stages', () => {
  const html = read('journey.html');
  const ids = getIds(html);

  for (const stage of ['preparing', 'starting', 'during', 'ending', 'after']) {
    assert.equal(ids.has(stage), true, `journey.html needs #${stage}`);
    assert.match(html, new RegExp(`href="#${stage}"`, 'i'), `journey.html needs a link to #${stage}`);
  }
});

test('provides accessible image placeholders', () => {
  for (const fileName of contentPages) {
    const html = read(fileName);
    const images = getTags(html, 'img');
    assert.ok(images.length > 0, `${fileName} needs a planned image`);
    assert.match(html, /Replace with an approved U-M image of/i, `${fileName} needs a replacement note`);

    for (const image of images) {
      const alt = getAttribute(image, 'alt');
      assert.notEqual(alt, null, `${fileName} image needs an alt attribute`);
      assert.ok(alt.trim().length >= 20, `${fileName} meaningful image needs descriptive alt text`);
      assert.match(image, /\swidth="\d+"/i, `${fileName} image needs intrinsic width`);
      assert.match(image, /\sheight="\d+"/i, `${fileName} image needs intrinsic height`);
    }
  }
});

test('includes the shared UMSI logo placeholder on every page', () => {
  assert.equal(fs.existsSync(path.join(root, 'images', 'umsi-logo-placeholder.svg')), true, 'the UMSI logo placeholder asset should exist');

  for (const fileName of pages) {
    const logo = getTags(read(fileName), 'img').find((tag) => tag.includes('site-brand__logo'));
    assert.ok(logo, `${fileName} needs the shared UMSI logo placeholder`);
    assert.equal(getAttribute(logo, 'src'), 'images/umsi-logo-placeholder.svg');
    assert.match(getAttribute(logo, 'alt') ?? '', /placeholder for the official UMSI logo/i);
    assert.match(logo, /\swidth="\d+"/i);
    assert.match(logo, /\sheight="\d+"/i);
  }
});

test('adds supporting image placeholders to the main guided pages', () => {
  for (const fileName of ['experiences.html', 'journey.html', 'resources.html']) {
    const html = read(fileName);
    assert.match(html, /<figure[^>]+class="supporting-media"/i, `${fileName} needs a supporting image panel`);
    assert.ok(getTags(html, 'img').length >= 3, `${fileName} should include a logo, hero image, and supporting image`);
  }
});

test('resolves local files and resource fragments', () => {
  const idsByPage = new Map(pages.map((fileName) => [fileName, getIds(read(fileName))]));

  for (const fileName of pages) {
    const links = getTags(read(fileName), 'a');

    for (const link of links) {
      const href = getAttribute(link, 'href');
      if (!href || /^(?:https?:|mailto:|tel:)/.test(href)) continue;

      const [targetPart, fragment] = href.split('#');
      const target = targetPart || fileName;
      assert.equal(fs.existsSync(path.join(root, target)), true, `${fileName} links to missing ${target}`);

      if (fragment) {
        assert.equal(idsByPage.get(target)?.has(fragment), true, `${fileName} links to missing ${target}#${fragment}`);
      }
    }
  }
});

test('requires resource links to target canonical resource cards', () => {
  const resourceIds = new Set(
    getTags(read('resources.html'), 'article')
      .filter((tag) => tag.includes('data-resource'))
      .map((tag) => getAttribute(tag, 'id'))
  );
  let resourceLinkCount = 0;

  for (const fileName of ['experiences.html', 'journey.html']) {
    const links = getTags(read(fileName), 'a').filter((tag) => tag.includes('data-resource-link'));
    resourceLinkCount += links.length;

    for (const link of links) {
      assertCanonicalResourceLink(link, fileName, resourceIds);
    }
  }

  assert.ok(resourceLinkCount >= resourceIds.size, 'resource-specific links need an explicit data-resource-link marker');

  for (const invalidHref of ['resources.html', 'resources.html#', 'resources.html#goal-settng', 'resources.html#page-heading']) {
    assert.throws(
      () => assertCanonicalResourceLink(`<a data-resource-link href="${invalidHref}">`, 'regression fixture', resourceIds),
      /resource link (?:needs one nonempty fragment|must target a canonical resource card)/,
      `${invalidHref} must fail resource-link validation`
    );
  }
});

test('keeps every resource definition canonical', () => {
  const resourceHtml = read('resources.html');
  const resourceTags = getTags(resourceHtml, 'article').filter((tag) => tag.includes('data-resource'));
  const resourceIds = resourceTags.map((tag) => getAttribute(tag, 'id'));

  assert.ok(resourceIds.length >= 10, 'resources.html should demonstrate a useful range of resources');
  assert.equal(new Set(resourceIds).size, resourceIds.length, 'resource IDs must be unique');

  for (const fileName of ['index.html', 'experiences.html', 'journey.html', '404.html']) {
    assert.equal(getTags(read(fileName), 'article').some((tag) => tag.includes('data-resource')), false, `${fileName} must not redefine resources`);
  }

  for (const resourceId of resourceIds) {
    assert.match(`${read('experiences.html')}\n${read('journey.html')}`, new RegExp(`resources\\.html#${resourceId}`), `${resourceId} should be discoverable outside the library`);
  }
});

test('reports the correct resource count before JavaScript runs', () => {
  const html = read('resources.html');
  const resourceCount = getTags(html, 'article').filter((tag) => tag.includes('data-resource')).length;
  const status = html.match(/data-filter-status[^>]*>Showing (\d+) resources\./i);

  assert.ok(status, 'resources.html needs an initial filter result count');
  assert.equal(Number(status[1]), resourceCount, 'the no-JavaScript count should match the resource cards');
});

test('loads the shared stylesheet', () => {
  assert.equal(fs.existsSync(path.join(root, 'css', 'style.css')), true);
  for (const fileName of pages) {
    assert.match(read(fileName), /<link[^>]+rel="stylesheet"[^>]+href="css\/style\.css"/i);
  }
});

test('defines approved U-M colors and inclusive interaction states', () => {
  const css = read('css/style.css');
  assert.match(css, /--color-blue:\s*#00274c\b/i);
  assert.match(css, /--color-maize:\s*#ffcb05\b/i);
  assert.match(css, /--color-tappan-red:\s*#9a3324\b/i);
  assert.match(css, /--color-ross-orange:\s*#d86018\b/i);
  assert.match(css, /--color-rackham-green:\s*#75988d\b/i);
  assert.match(css, /--color-taubman-teal:\s*#00b2a9\b/i);
  assert.match(css, /--color-arboretum-blue:\s*#2f65a7\b/i);
  assert.match(css, /--color-matthaei-violet:\s*#575294\b/i);
  assert.match(css, /:focus-visible\s*\{/i);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/i);
  assert.match(css, /@media\s*\(min-width:\s*70rem\)/i);
});

test('keeps images and media responsive', () => {
  const css = read('css/style.css');
  assert.match(css, /img\s*\{[^}]*max-width:\s*100%[^}]*height:\s*auto/si);
  assert.match(css, /\.responsive-media\s*\{[^}]*max-width:\s*100%[^}]*aspect-ratio:/si);
});

test('uses mobile-first grids with tablet laptop and desktop enhancements', () => {
  const css = read('css/style.css');
  assert.match(css, /\.route-grid[\s\S]*?display:\s*grid/i);
  assert.match(css, /\.experience-grid[\s\S]*?display:\s*grid/i);
  assert.match(css, /\.resource-grid[\s\S]*?display:\s*grid/i);
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/i);
  assert.match(css, /@media\s*\(min-width:\s*64rem\)/i);
  assert.match(css, /@media\s*\(min-width:\s*70rem\)/i);
});

test('makes filter state perceivable beyond color', () => {
  const css = read('css/style.css');
  assert.match(css, /\.filter-buttons\s+button\[aria-pressed=['"]true['"]\]\s*\{[^}]*(?:border|box-shadow|outline|text-decoration):/si);
  assert.match(css, /\[hidden\]\s*\{[^}]*display:\s*none/si);
});

test('supports forced colors without hiding required content at breakpoints', () => {
  const css = read('css/style.css');
  assert.match(css, /@media\s*\(forced-colors:\s*active\)/i);

  const mediaRules = css.match(/@media\s*\(min-width:[\s\S]*?\n\}/gi) ?? [];
  for (const mediaRule of mediaRules) {
    assert.doesNotMatch(mediaRule, /(?:\.resource-card|\.journey-stage|\.experience-card)[^{]*\{[^}]*display:\s*none/si);
  }
});

test('404 recovery links resolve from nested GitHub Pages routes', () => {
  const html = read('404.html');
  const baseTag = html.match(/<base[^>]+href="([^"]+)"/i);
  assert.ok(baseTag, '404.html needs a deployment base URL');

  const nestedMissingUrl = new URL('https://example.com/Career_dev_web-ClientProj/missing/page');
  const documentBase = new URL(baseTag[1], nestedMissingUrl);
  assert.equal(new URL('index.html', documentBase).pathname, '/Career_dev_web-ClientProj/index.html');
  assert.equal(new URL('resources.html', documentBase).pathname, '/Career_dev_web-ClientProj/resources.html');
});
