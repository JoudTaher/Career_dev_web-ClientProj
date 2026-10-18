const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'preparing.html', 'starting.html', 'during.html', '404.html'];
const primaryPages = pages.slice(0, 4);

function readPage(fileName) {
  return fs.readFileSync(path.join(root, fileName), 'utf8');
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[1] ?? match[2]) : null;
}

test('creates all five required pages', () => {
  for (const fileName of pages) {
    assert.equal(fs.existsSync(path.join(root, fileName)), true, `${fileName} should exist`);
  }
});

test('provides accessible shared page structure', () => {
  for (const fileName of pages) {
    const html = readPage(fileName);
    assert.match(html, /<html[^>]+lang="en"/i, `${fileName} needs a language`);
    assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#main-content"/i, `${fileName} needs a skip link`);
    assert.match(html, /<header\b/i, `${fileName} needs a header landmark`);
    assert.match(html, /<nav[^>]+aria-label="Primary navigation"/i, `${fileName} needs labeled navigation`);
    assert.match(html, /<main[^>]+id="main-content"/i, `${fileName} needs the skip-link target`);
    assert.match(html, /<footer\b/i, `${fileName} needs a footer landmark`);
  }
});

test('uses unique titles and one h1 per page', () => {
  const titles = new Set();

  for (const fileName of pages) {
    const html = readPage(fileName);
    const title = html.match(/<title>([^<]+)<\/title>/i);
    assert.ok(title, `${fileName} needs a title`);
    assert.equal(titles.has(title[1]), false, `${fileName} title should be unique`);
    titles.add(title[1]);

    const headings = html.match(/<h1\b/gi) ?? [];
    assert.equal(headings.length, 1, `${fileName} should contain exactly one h1`);
  }
});

test('provides accessible image placeholders', () => {
  for (const fileName of primaryPages) {
    const html = readPage(fileName);
    const images = html.match(/<img\b[^>]*>/gi) ?? [];
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

test('marks the current navigation item', () => {
  const expectedLinks = {
    'index.html': 'index.html',
    'preparing.html': 'preparing.html',
    'starting.html': 'starting.html',
    'during.html': 'during.html'
  };

  for (const [fileName, href] of Object.entries(expectedLinks)) {
    const html = readPage(fileName);
    const currentLinks = html.match(/<a[^>]+aria-current="page"[^>]*>/gi) ?? [];
    assert.equal(currentLinks.length, 1, `${fileName} needs one current navigation item`);
    assert.equal(getAttribute(currentLinks[0], 'href'), href, `${fileName} should mark ${href} current`);
  }
});

test('resolves every local page link', () => {
  for (const fileName of pages) {
    const html = readPage(fileName);
    const links = html.match(/<a\b[^>]*href=(?:"[^"]+"|'[^']+')[^>]*>/gi) ?? [];

    for (const link of links) {
      const href = getAttribute(link, 'href');
      if (!href || href.startsWith('#') || /^(?:https?:|mailto:|tel:)/.test(href)) continue;

      const target = href.split('#')[0];
      assert.equal(fs.existsSync(path.resolve(root, target)), true, `${fileName} links to missing ${target}`);
    }
  }
});

test('loads the shared stylesheet', () => {
  const stylesheetPath = path.join(root, 'css', 'style.css');
  assert.equal(fs.existsSync(stylesheetPath), true, 'css/style.css should exist');

  for (const fileName of pages) {
    assert.match(readPage(fileName), /<link[^>]+rel="stylesheet"[^>]+href="css\/style\.css"/i);
  }
});

test('defines approved U-M colors', () => {
  const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
  assert.match(css, /--color-blue:\s*#00274c\b/i);
  assert.match(css, /--color-maize:\s*#ffcb05\b/i);
});

test('shows keyboard focus', () => {
  const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
  assert.match(css, /:focus-visible\s*\{/i);
  assert.match(css, /outline:\s*[^;]+;/i);
});

test('supports reduced motion', () => {
  const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});

test('adds tablet and desktop responsive rules', () => {
  const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/i);
  assert.match(css, /@media\s*\(min-width:\s*70rem\)/i);
});
