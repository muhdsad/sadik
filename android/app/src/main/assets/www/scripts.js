/**
 * Mohammed Sadique - Digital Hub & Workspace Dashboard
 * Senior UX & Frontend Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle Management ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from localStorage or system preference
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('hub_theme');
  } catch (err) {
    // localStorage restricted/disabled
  }
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('hub_theme', theme);
    } catch (err) {
      // localStorage restricted/disabled
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const icon = themeToggleBtn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  // --- Real-time Search Filtering ---
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const appCards = document.querySelectorAll('.app-card');
  const categoryChips = document.querySelectorAll('.chip');
  const noResultsMsg = document.getElementById('no-results');

  let activeCategory = 'all';

  function filterCards() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    appCards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const category = card.getAttribute('data-category') || '';
      const tags = card.getAttribute('data-tags') || '';
      const url = card.getAttribute('data-url') || '';

      const matchesSearch = !query || 
        title.toLowerCase().includes(query) || 
        tags.toLowerCase().includes(query) ||
        url.toLowerCase().includes(query);

      const categoryTokens = category ? category.toLowerCase().split(/\s+/) : [];
      const matchesCategory = activeCategory === 'all' || categoryTokens.includes(activeCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (clearSearchBtn) {
      clearSearchBtn.style.visibility = query ? 'visible' : 'hidden';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        filterCards();
      }
    });
  }

  // Keyboard shortcut: Press '/' or 'Cmd+K' / 'Ctrl+K' to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' && document.activeElement !== searchInput) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // Category chip selection
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });

  // --- Interactive Workspace / Iframe Manager ---
  const workspaceFrame = document.getElementById('workspace-frame');
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceUrlBar = document.getElementById('workspace-url-bar');
  const workspaceSection = document.getElementById('workspace');
  const reloadBtn = document.getElementById('frame-reload');
  const externalBtn = document.getElementById('frame-external');
  const expandBtn = document.getElementById('frame-expand');
  const defaultArtCard = document.getElementById('default-art-card');
  const frameContainer = document.querySelector('.workspace-window');

  let currentAppUrl = '';

  function openInWorkspace(url, title, iconSymbol = '🌐') {
    if (!workspaceFrame) return;

    currentAppUrl = url;
    
    // Hide default artwork, show frame
    if (defaultArtCard) defaultArtCard.style.display = 'none';
    workspaceFrame.style.display = 'block';

    workspaceFrame.src = url;
    if (workspaceTitle) {
      workspaceTitle.innerHTML = `<span class="app-icon-mini">${iconSymbol}</span> ${title}`;
    }
    if (workspaceUrlBar) {
      workspaceUrlBar.value = url;
    }

    // Scroll workspace into view smoothly on mobile/smaller screens
    if (workspaceSection && window.innerWidth < 992) {
      workspaceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Handle card launch buttons
  document.querySelectorAll('[data-action="launch-workspace"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.app-card');
      if (card) {
        const url = card.getAttribute('data-url');
        const title = card.getAttribute('data-title');
        const icon = card.getAttribute('data-icon') || '🌐';
        if (url) {
          openInWorkspace(url, title, icon);
        }
      }
    });
  });

  // Controls for frame
  if (reloadBtn && workspaceFrame) {
    reloadBtn.addEventListener('click', () => {
      if (workspaceFrame.src) {
        const current = workspaceFrame.src;
        workspaceFrame.src = '';
        workspaceFrame.src = current;
      }
    });
  }

  if (externalBtn) {
    externalBtn.addEventListener('click', () => {
      if (currentAppUrl) {
        window.open(currentAppUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  if (expandBtn && frameContainer) {
    expandBtn.addEventListener('click', () => {
      frameContainer.classList.toggle('expanded');
      const isExpanded = frameContainer.classList.contains('expanded');
      expandBtn.setAttribute('title', isExpanded ? 'Collapse Window' : 'Expand Window');
    });
  }

  // Quick navigation mobile toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navList = document.querySelector('nav ul');

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navList.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', navList.classList.contains('open'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navList.classList.contains('open') && !navList.contains(e.target) && e.target !== mobileMenuToggle) {
        navList.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking any nav link
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Register Service Worker for PWA / Android Offline Support ---
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('SW registration skipped or failed:', err);
      });
    });
  }
});

