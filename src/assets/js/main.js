/**
 * Swiss Design Blog
 * Minimal JavaScript — only essential functionality
 */

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

  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
  });

})();
