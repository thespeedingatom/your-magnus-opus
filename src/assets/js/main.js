/**
 * Readymag Portfolio Design System
 * Motion & interaction layer with GSAP
 */

import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject();

(function() {
  'use strict';

  // ============================================================================
  // THEME MANAGER
  // ============================================================================
  const ThemeManager = {
    STORAGE_KEY: 'theme-preference',

    init() {
      this.toggle = document.querySelector('.theme-toggle');
      if (!this.toggle) return;

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
      const newTheme = this.getTheme() === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },

    bindEvents() {
      this.toggle.addEventListener('click', () => this.toggleTheme());

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // ============================================================================
  // DYNAMIC ISLAND
  // ============================================================================
  const DynamicIsland = {
    init() {
      this.island = document.querySelector('.dynamic-island');
      this.title = document.querySelector('.island-title');
      this.progressBar = document.querySelector('.island-progress-bar');
      this.isPostPage = document.body.classList.contains('is-post-page');

      if (!this.island) return;

      this.heroSection = document.querySelector('.section--hero, .post-hero');
      this.bindEvents();
    },

    updateIsland() {
      if (!this.heroSection) return;

      const heroRect = this.heroSection.getBoundingClientRect();
      const shouldShowTitle = heroRect.bottom < 100;

      if (shouldShowTitle) {
        this.island.classList.add('show-title');
      } else {
        this.island.classList.remove('show-title');
      }

      // Update reading progress on post pages
      if (this.isPostPage && this.progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((window.scrollY / docHeight) * 100, 100);
        this.progressBar.style.width = `${progress}%`;
      }
    },

    bindEvents() {
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.updateIsland();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // Initial update
      this.updateIsland();
    }
  };

  // ============================================================================
  // PAGE TRANSITIONS
  // ============================================================================
  const PageTransitions = {
    init() {
      this.overlay = document.querySelector('.page-transition');
      if (!this.overlay || !window.gsap) return;

      this.bindEvents();
    },

    animateOut(href) {
      return new Promise((resolve) => {
        gsap.to(this.overlay, {
          y: '0%',
          duration: 0.6,
          ease: 'power4.inOut',
          onComplete: () => {
            window.location.href = href;
            resolve();
          }
        });
      });
    },

    bindEvents() {
      // Intercept internal link clicks
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');

          // Skip if modifier key pressed or same page
          if (e.metaKey || e.ctrlKey || href === window.location.pathname) return;

          e.preventDefault();
          this.animateOut(href);
        });
      });

      // Animate in on page load
      gsap.set(this.overlay, { y: '0%' });
      gsap.to(this.overlay, {
        y: '-100%',
        duration: 0.6,
        ease: 'power4.inOut',
        delay: 0.1
      });
    }
  };

  // ============================================================================
  // SCROLL ANIMATIONS (GSAP)
  // ============================================================================
  const ScrollAnimations = {
    init() {
      if (!window.gsap || !window.ScrollTrigger) {
        // Fallback: just make elements visible
        this.showAllElements();
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.showAllElements();
        return;
      }

      this.initHeroAnimations();
      this.initFadeUpAnimations();
      this.initSplitLineAnimations();
      this.initStaggerAnimations();
    },

    showAllElements() {
      // Remove animation classes and show content immediately
      document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-stagger > *').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('.animate-split-line span').forEach(el => {
        el.style.transform = 'none';
      });
    },

    initHeroAnimations() {
      const heroLines = document.querySelectorAll('.hero-name-line span, .post-title-line span');

      if (heroLines.length === 0) return;

      // Set initial state
      gsap.set(heroLines, { y: '100%' });

      // Animate in
      gsap.to(heroLines, {
        y: '0%',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.3
      });

      // Hero tagline and scroll indicator
      const heroTagline = document.querySelector('.hero-tagline');
      const heroScroll = document.querySelector('.hero-scroll');

      if (heroTagline) {
        gsap.set(heroTagline, { opacity: 0, y: 30 });
        gsap.to(heroTagline, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1
        });
      }

      if (heroScroll) {
        gsap.set(heroScroll, { opacity: 0 });
        gsap.to(heroScroll, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 1.4
        });
      }
    },

    initFadeUpAnimations() {
      const fadeUpElements = document.querySelectorAll('.animate-fade-up');

      fadeUpElements.forEach(el => {
        // Skip hero elements (handled separately)
        if (el.closest('.section--hero') || el.closest('.post-hero')) return;

        gsap.set(el, { opacity: 0, y: 40 });

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out'
            });
          }
        });
      });
    },

    initSplitLineAnimations() {
      const splitLines = document.querySelectorAll('.section:not(.section--hero) .animate-split-line span');

      splitLines.forEach(line => {
        gsap.set(line, { y: '100%' });

        ScrollTrigger.create({
          trigger: line.closest('.animate-split-line'),
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(line, {
              y: '0%',
              duration: 0.8,
              ease: 'power3.out'
            });
          }
        });
      });
    },

    initStaggerAnimations() {
      const staggerContainers = document.querySelectorAll('.animate-stagger');

      staggerContainers.forEach(container => {
        const children = container.children;

        gsap.set(children, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: container,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.1
            });
          }
        });
      });
    }
  };

  // ============================================================================
  // POST CARD ANIMATIONS
  // ============================================================================
  const PostCards = {
    init() {
      if (!window.gsap || !window.ScrollTrigger) return;

      const cards = document.querySelectorAll('.post-card');

      if (cards.length === 0) return;

      // Check for reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
        return;
      }

      // Set initial state
      gsap.set(cards, { opacity: 0, y: 60 });

      // Batch animation for better performance
      ScrollTrigger.batch(cards, {
        start: 'top 85%',
        once: true,
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15
          });
        }
      });
    }
  };

  // ============================================================================
  // PROSE ANIMATIONS
  // ============================================================================
  const ProseAnimations = {
    init() {
      if (!window.gsap || !window.ScrollTrigger) return;

      const proseElements = document.querySelectorAll('.prose > *');

      if (proseElements.length === 0) return;

      // Check for reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Subtle fade for prose content
      proseElements.forEach((el, index) => {
        // Skip first few elements (they're above fold)
        if (index < 3) return;

        gsap.set(el, { opacity: 0.3 });

        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(el, { opacity: 0.3 + (self.progress * 0.7) });
          }
        });
      });
    }
  };

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  const init = () => {
    ThemeManager.init();
    DynamicIsland.init();
  };

  const initAnimations = () => {
    // Wait for GSAP to load
    if (window.gsap && window.ScrollTrigger) {
      PageTransitions.init();
      ScrollAnimations.init();
      PostCards.init();
      ProseAnimations.init();
    } else {
      // GSAP not loaded, show content anyway
      ScrollAnimations.showAllElements && ScrollAnimations.showAllElements();
    }
  };

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Run animations after GSAP loads
  window.addEventListener('load', () => {
    // Small delay to ensure GSAP is ready
    requestAnimationFrame(() => {
      initAnimations();
    });
  });

})();
