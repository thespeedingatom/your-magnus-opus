/**
 * Swiss Design Blog - Main JavaScript
 * Parallax effects, dark mode, and scroll interactions
 */

(function() {
  'use strict';

  // ==========================================================================
  // Theme Management
  // ==========================================================================

  const ThemeManager = {
    STORAGE_KEY: 'theme-preference',

    init() {
      this.toggle = document.querySelector('.theme-toggle');
      if (!this.toggle) return;

      // Set initial theme
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');

      this.setTheme(theme);
      this.bindEvents();
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
    },

    getTheme() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    toggleTheme() {
      const currentTheme = this.getTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },

    bindEvents() {
      this.toggle.addEventListener('click', () => this.toggleTheme());

      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // ==========================================================================
  // Parallax Effects
  // ==========================================================================

  const ParallaxManager = {
    elements: [],
    ticking: false,

    init() {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      this.setupElements();
      this.bindEvents();
    },

    setupElements() {
      // Geometric background elements with different parallax speeds
      const geoCircle = document.querySelector('.geo-circle');
      const geoLine1 = document.querySelector('.geo-line-1');
      const geoLine2 = document.querySelector('.geo-line-2');
      const geoDot1 = document.querySelector('.geo-dot-1');
      const geoDot2 = document.querySelector('.geo-dot-2');
      const geoDot3 = document.querySelector('.geo-dot-3');
      const typoLetter = document.querySelector('.typo-letter');
      const footerYear = document.querySelector('.footer-year span');

      // Define parallax elements with their speed multipliers
      // Positive = moves with scroll, Negative = moves against scroll
      if (geoCircle) this.elements.push({ el: geoCircle, speed: 0.15, axis: 'y' });
      if (geoLine1) this.elements.push({ el: geoLine1, speed: -0.08, axis: 'y' });
      if (geoLine2) this.elements.push({ el: geoLine2, speed: 0.12, axis: 'y' });
      if (geoDot1) this.elements.push({ el: geoDot1, speed: -0.2, axis: 'y' });
      if (geoDot2) this.elements.push({ el: geoDot2, speed: 0.1, axis: 'y' });
      if (geoDot3) this.elements.push({ el: geoDot3, speed: -0.15, axis: 'y' });
      if (typoLetter) this.elements.push({ el: typoLetter, speed: 0.05, axis: 'y' });
      if (footerYear) this.elements.push({ el: footerYear, speed: -0.08, axis: 'y' });
    },

    updatePositions() {
      const scrollY = window.scrollY;

      this.elements.forEach(({ el, speed, axis }) => {
        const offset = scrollY * speed;

        if (axis === 'y') {
          el.style.transform = `translateY(${offset}px)`;
        } else if (axis === 'x') {
          el.style.transform = `translateX(${offset}px)`;
        }
      });

      this.ticking = false;
    },

    onScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => this.updatePositions());
        this.ticking = true;
      }
    },

    bindEvents() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
  };

  // ==========================================================================
  // Scroll Reveal for Post Cards
  // ==========================================================================

  const ScrollReveal = {
    init() {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Show all cards immediately
        document.querySelectorAll('.post-card').forEach(card => {
          card.classList.add('is-visible');
        });
        return;
      }

      this.setupObserver();
    },

    setupObserver() {
      const options = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger the animation
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, index * 100);

            // Unobserve after revealing
            observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('.post-card').forEach(card => {
        observer.observe(card);
      });
    }
  };

  // ==========================================================================
  // Smooth Scroll Links
  // ==========================================================================

  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ==========================================================================
  // Reading Progress Indicator (Optional Enhancement)
  // ==========================================================================

  const ReadingProgress = {
    init() {
      // Only on post pages
      const postContent = document.querySelector('.post-full-content');
      if (!postContent) return;

      this.createProgressBar();
      this.bindEvents();
    },

    createProgressBar() {
      const bar = document.createElement('div');
      bar.className = 'reading-progress';
      bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--color-accent);
        z-index: 9999;
        transition: width 0.1s linear;
      `;
      document.body.appendChild(bar);
      this.bar = bar;
    },

    updateProgress() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      this.bar.style.width = `${Math.min(scrolled, 100)}%`;
    },

    bindEvents() {
      window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    }
  };

  // ==========================================================================
  // Initialize Everything
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    ParallaxManager.init();
    ScrollReveal.init();
    SmoothScroll.init();
    ReadingProgress.init();
  });

})();
