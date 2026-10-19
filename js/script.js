function initializeResourceFilters(documentObject) {
  const library = documentObject.querySelector('[data-resource-library]');
  if (!library) return;

  const buttons = Array.from(documentObject.querySelectorAll('[data-filter-group][data-filter-value]'));
  const cards = Array.from(documentObject.querySelectorAll('[data-resource]'));
  const status = documentObject.querySelector('[data-filter-status]');
  const groups = [...new Set(buttons.map((button) => button.dataset.filterGroup))];
  const activeFilters = new Map();

  for (const group of groups) {
    const selectedButton = buttons.find((button) => button.dataset.filterGroup === group && button.getAttribute('aria-pressed') === 'true');
    activeFilters.set(group, selectedButton?.dataset.filterValue || 'all');
  }

  function applyFilters() {
    let visibleCount = 0;

    for (const card of cards) {
      const hasCompleteData = groups.every((group) => typeof card.dataset[group] === 'string' && card.dataset[group].trim().length > 0);
      const matches = hasCompleteData && groups.every((group) => {
        const selectedValue = activeFilters.get(group);
        if (selectedValue === 'all') return true;
        return card.dataset[group].split(/\s+/).includes(selectedValue);
      });

      card.hidden = !matches;
      if (matches) visibleCount += 1;
    }

    if (status) status.textContent = `Showing ${visibleCount} resources.`;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const { filterGroup, filterValue } = button.dataset;
      activeFilters.set(filterGroup, filterValue);

      for (const groupButton of buttons) {
        if (groupButton.dataset.filterGroup === filterGroup) {
          groupButton.setAttribute('aria-pressed', String(groupButton === button));
        }
      }

      applyFilters();
    });
  }

  applyFilters();
}

function initializeSite(documentObject, windowObject) {
  const yearElements = documentObject.querySelectorAll('[data-current-year]');
  const DateConstructor = windowObject.Date || Date;
  const currentYear = new DateConstructor().getFullYear();

  for (const element of yearElements) {
    element.textContent = String(currentYear);
  }

  initializeResourceFilters(documentObject);

  const menuButton = documentObject.querySelector('#menu-toggle');
  const navigation = documentObject.querySelector('#primary-navigation');

  if (!menuButton || !navigation || typeof windowObject.matchMedia !== 'function') return;

  const desktopQuery = windowObject.matchMedia('(min-width: 48rem)');
  const navigationLinks = documentObject.querySelectorAll('.site-nav__link');

  function setMenuState(isOpen) {
    navigation.hidden = !isOpen;
    menuButton.setAttribute('aria-expanded', String(isOpen));
  }

  function syncWithViewport(event) {
    setMenuState(event.matches);
  }

  menuButton.hidden = false;
  syncWithViewport(desktopQuery);

  menuButton.addEventListener('click', () => {
    setMenuState(navigation.hidden);
  });

  for (const link of navigationLinks) {
    link.addEventListener('click', () => {
      if (!desktopQuery.matches) setMenuState(false);
    });
  }

  documentObject.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !desktopQuery.matches && !navigation.hidden) {
      setMenuState(false);
      menuButton.focus();
    }
  });

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', syncWithViewport);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(syncWithViewport);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeResourceFilters, initializeSite };
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeSite(document, window));
} else {
  initializeSite(document, window);
}
