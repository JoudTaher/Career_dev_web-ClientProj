const test = require('node:test');
const assert = require('node:assert/strict');
const { initializeSite } = require('../js/script.js');

class FakeElement {
  constructor() {
    this.hidden = false;
    this.textContent = '';
    this.focused = false;
    this.attributes = new Map();
    this.listeners = new Map();
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener(event);
  }

  focus() {
    this.focused = true;
  }
}

class FakeDocument {
  constructor({ includeMenu = true } = {}) {
    this.menuButton = includeMenu ? new FakeElement() : null;
    this.navigation = includeMenu ? new FakeElement() : null;
    this.links = includeMenu ? [new FakeElement(), new FakeElement()] : [];
    this.years = [new FakeElement(), new FakeElement()];
    this.listeners = new Map();
  }

  querySelector(selector) {
    if (selector === '#menu-toggle') return this.menuButton;
    if (selector === '#primary-navigation') return this.navigation;
    return null;
  }

  querySelectorAll(selector) {
    if (selector === '.site-nav__link') return this.links;
    if (selector === '[data-current-year]') return this.years;
    return [];
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener(event);
  }
}

class FakeMediaQuery {
  constructor(matches) {
    this.matches = matches;
    this.listeners = [];
  }

  addEventListener(type, listener) {
    if (type === 'change') this.listeners.push(listener);
  }

  change(matches) {
    this.matches = matches;
    for (const listener of this.listeners) listener({ matches });
  }
}

function createWindow(matches = false) {
  const mediaQuery = new FakeMediaQuery(matches);
  class FixedDate {
    getFullYear() {
      return 2042;
    }
  }

  return {
    mediaQuery,
    windowObject: {
      Date: FixedDate,
      matchMedia(query) {
        assert.equal(query, '(min-width: 48rem)');
        return mediaQuery;
      }
    }
  };
}

test('opens and closes the mobile menu', () => {
  const documentObject = new FakeDocument();
  const { windowObject } = createWindow(false);

  initializeSite(documentObject, windowObject);

  assert.equal(documentObject.menuButton.hidden, false);
  assert.equal(documentObject.navigation.hidden, true);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'false');

  documentObject.menuButton.dispatch('click');
  assert.equal(documentObject.navigation.hidden, false);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'true');

  documentObject.menuButton.dispatch('click');
  assert.equal(documentObject.navigation.hidden, true);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'false');
});

test('closes the menu after navigation or Escape', () => {
  const documentObject = new FakeDocument();
  const { windowObject } = createWindow(false);
  initializeSite(documentObject, windowObject);

  documentObject.menuButton.dispatch('click');
  documentObject.links[0].dispatch('click');
  assert.equal(documentObject.navigation.hidden, true);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'false');

  documentObject.menuButton.dispatch('click');
  documentObject.dispatch('keydown', { key: 'Escape' });
  assert.equal(documentObject.navigation.hidden, true);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'false');
  assert.equal(documentObject.menuButton.focused, true);
});

test('resets navigation at the desktop breakpoint', () => {
  const documentObject = new FakeDocument();
  const { mediaQuery, windowObject } = createWindow(true);
  initializeSite(documentObject, windowObject);

  assert.equal(documentObject.navigation.hidden, false);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'true');

  mediaQuery.change(false);
  assert.equal(documentObject.navigation.hidden, true);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'false');

  mediaQuery.change(true);
  assert.equal(documentObject.navigation.hidden, false);
  assert.equal(documentObject.menuButton.getAttribute('aria-expanded'), 'true');
});

test('writes the current footer year', () => {
  const documentObject = new FakeDocument();
  const { windowObject } = createWindow(false);
  initializeSite(documentObject, windowObject);

  assert.deepEqual(documentObject.years.map((element) => element.textContent), ['2042', '2042']);
});

test('exits safely when optional elements are absent', () => {
  const documentObject = new FakeDocument({ includeMenu: false });
  const { windowObject } = createWindow(false);

  assert.doesNotThrow(() => initializeSite(documentObject, windowObject));
  assert.deepEqual(documentObject.years.map((element) => element.textContent), ['2042', '2042']);
});
