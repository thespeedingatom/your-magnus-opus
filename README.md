# Aman Mohd Azam — Personal Blog

A typography-focused personal blog built with [Eleventy](https://www.11ty.dev/), inspired by Swiss design principles.

## Features

- **Swiss Design System** — Bold typography hierarchy with Helvetica, mathematical grid, intentional whitespace
- **Parallax Effects** — Layered geometric elements that respond to scroll
- **Dark Mode** — System-aware with manual toggle, persisted to localStorage
- **Responsive** — Adaptive layout from mobile to desktop
- **Fast** — Static site generation, minimal JavaScript, no framework bloat
- **Accessible** — Semantic HTML, reduced motion support, keyboard navigation

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The dev server runs at `http://localhost:8080` with hot reload.

## Project Structure

```
├── src/
│   ├── _data/
│   │   └── site.json          # Global site data
│   ├── _includes/
│   │   └── layouts/
│   │       ├── base.njk       # Base HTML template
│   │       └── post.njk       # Single post template
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css      # All styles
│   │   └── js/
│   │       └── main.js        # Parallax, theme, scroll effects
│   ├── posts/
│   │   ├── posts.json         # Directory data for posts
│   │   └── *.md               # Blog posts
│   └── index.njk              # Home page / blog listing
├── .eleventy.js               # Eleventy configuration
├── package.json
└── vercel.json                # Vercel deployment config
```

## Writing Posts

Create a new `.md` file in `src/posts/`:

```markdown
---
title: "Your Post Title"
date: 2025-01-01
excerpt: "A brief description for the post card."
tags:
  - design
  - technology
---

Your content here...
```

Posts are sorted by date (newest first) and automatically appear on the home page.

## Customization

### Site Data

Edit `src/_data/site.json` to update:
- Author name, bio, and role
- Social links

### Colors

The color palette is defined as CSS custom properties in `src/assets/css/style.css`:

```css
:root {
  --color-bg: #FAFAFA;
  --color-text: #0A0A0A;
  --color-accent: #E63329;  /* Swiss red */
  /* ... */
}

[data-theme="dark"] {
  --color-bg: #0A0A0A;
  --color-text: #FAFAFA;
  --color-accent: #FF4136;
  /* ... */
}
```

### Typography

The type scale uses fluid sizing with `clamp()`. Adjust in the CSS custom properties section.

## Deployment

Configured for Vercel:

```bash
# Via Vercel CLI
vercel

# Or connect your Git repository at vercel.com
```

Build command: `npm run build`
Output directory: `_site`

## Design Philosophy

This blog embraces the principles of the International Typographic Style:

- **Objectivity** — Content speaks for itself
- **Clarity** — Information hierarchy guides the eye
- **Order** — Grid-based layout creates rhythm

The oversized typography and geometric shapes aren't decoration—they're structural elements that establish visual rhythm and reinforce hierarchy.

---

Built with care.
