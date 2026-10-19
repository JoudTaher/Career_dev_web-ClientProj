function initializeSite(documentObject, windowObject) {
  const yearElements = documentObject.querySelectorAll('[data-current-year]');
  const DateConstructor = windowObject.Date || Date;
  const currentYear = new DateConstructor().getFullYear();

  for (const element of yearElements) {
    element.textContent = String(currentYear);
  }

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
  module.exports = { initializeSite };
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeSite(document, window));
} else {
  initializeSite(document, window);
}
