const test = require('node:test');
const assert = require('node:assert/strict');
const { initializeResourceFilters, initializeSite } = require('../js/script.js');

class FakeElement {
  constructor() {
    this.hidden = false;
    this.textContent = '';
    this.focused = false;
    this.dataset = {};
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

class FakeFilterDocument {
  constructor() {
    this.library = new FakeElement();
    this.status = new FakeElement();
    this.buttons = [
      this.createButton('stage', 'all', 'true'),
      this.createButton('stage', 'preparing'),
      this.createButton('stage', 'during'),
      this.createButton('type', 'all', 'true'),
      this.createButton('type', 'worksheet'),
      this.createButton('type', 'guide')
    ];
    this.cards = [
      this.createCard({ stage: 'preparing', experience: 'client', type: 'worksheet' }),
      this.createCard({ stage: 'during', experience: 'client community', type: 'guide' }),
      this.createCard({ stage: 'during', experience: 'research', type: 'worksheet' }),
      this.createCard({ stage: '', experience: 'client', type: 'guide' })
    ];
  }

  createButton(group, value, pressed = 'false') {
    const button = new FakeElement();
    button.dataset.filterGroup = group;
    button.dataset.filterValue = value;
    button.setAttribute('aria-pressed', pressed);
    return button;
  }

  createCard(data) {
    const card = new FakeElement();
    card.dataset = { ...data };
    return card;
  }

  querySelector(selector) {
    if (selector === '[data-resource-library]') return this.library;
    if (selector === '[data-filter-status]') return this.status;
    return null;
  }

  querySelectorAll(selector) {
    if (selector === '[data-filter-group][data-filter-value]') return this.buttons;
    if (selector === '[data-resource]') return this.cards;
    return [];
  }

  button(group, value) {
    return this.buttons.find((button) => button.dataset.filterGroup === group && button.dataset.filterValue === value);
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

test('filters resources by one group', () => {
  const documentObject = new FakeFilterDocument();
  initializeResourceFilters(documentObject);

  documentObject.button('stage', 'preparing').dispatch('click');

  assert.deepEqual(documentObject.cards.map((card) => card.hidden), [false, true, true, true]);
});

test('combines active filter groups', () => {
  const documentObject = new FakeFilterDocument();
  initializeResourceFilters(documentObject);

  documentObject.button('stage', 'during').dispatch('click');
  documentObject.button('type', 'guide').dispatch('click');

  assert.deepEqual(documentObject.cards.map((card) => card.hidden), [true, false, true, true]);
});

test('show all resets one group', () => {
  const documentObject = new FakeFilterDocument();
  initializeResourceFilters(documentObject);

  documentObject.button('stage', 'during').dispatch('click');
  documentObject.button('stage', 'all').dispatch('click');

  assert.deepEqual(documentObject.cards.map((card) => card.hidden), [false, false, false, true]);
});

test('updates aria-pressed and the live result count', () => {
  const documentObject = new FakeFilterDocument();
  initializeResourceFilters(documentObject);

  assert.equal(documentObject.status.textContent, 'Showing 3 resources.');
  documentObject.button('type', 'worksheet').dispatch('click');

  assert.equal(documentObject.button('type', 'worksheet').getAttribute('aria-pressed'), 'true');
  assert.equal(documentObject.button('type', 'all').getAttribute('aria-pressed'), 'false');
  assert.equal(documentObject.status.textContent, 'Showing 2 resources.');
});

test('leaves the page safe when filter markup is absent', () => {
  const documentObject = {
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };

  assert.doesNotThrow(() => initializeResourceFilters(documentObject));
});
