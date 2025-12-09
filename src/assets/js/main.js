/**
 * Swiss Design Blog
 * Minimal JavaScript — only essential functionality
 */

import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject();

(function() {
  'use strict';

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

  const StickyHeader = {
    init() {
      this.header = document.querySelector('.post-sticky-header');
      this.postHeader = document.querySelector('#post-header');
      this.progressBar = document.querySelector('.reading-progress');

      if (!this.header || !this.postHeader) return;

      this.bindEvents();
    },

    updateHeader() {
      const postHeaderRect = this.postHeader.getBoundingClientRect();
      const shouldShow = postHeaderRect.bottom < 0;

      if (shouldShow) {
        this.header.classList.add('is-visible');
      } else {
        this.header.classList.remove('is-visible');
      }

      // Update reading progress
      if (this.progressBar) {
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
            this.updateHeader();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    StickyHeader.init();
  });

})();
