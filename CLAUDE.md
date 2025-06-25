# CLAUDE.md

日本語で回答してください。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally

### Code Quality

- `npx biome check` - Run linter and formatter checks
- `npx biome format` - Format code with Biome
- `npx biome lint` - Run linting only

### Content Management

- `npm run export-content` - Export content from NEWT CMS to local Markdown files and images

## Architecture

This is an Astro-based personal blog/portfolio site that can work with either Newt CMS or local Markdown files for content management.

### Key Components

- **Content Management**: Uses local Markdown files with gray-matter for frontmatter parsing, with optional NEWT CMS export functionality
- **Styling**: GSAP for animations, custom CSS components
- **Code Quality**: Biome for linting/formatting, Prettier for Astro files

### Project Structure

```
src/
├── components/        # Reusable Astro components
│   ├── BlogCard.astro        # Blog post preview cards
│   ├── BlogSidebar.astro     # Blog navigation sidebar
│   ├── TagListItem.astro     # Tag display components
│   └── ...
├── layouts/           # Page layouts
│   └── Layout.astro          # Main layout wrapper
├── lib/               # Utility functions and API clients
│   ├── content.ts           # Local Markdown content utilities
│   ├── newt.ts              # Newt CMS client and type definitions (legacy)
│   ├── blog.ts              # Blog-related utilities (legacy)
│   └── utils.ts             # General utilities
├── pages/             # File-based routing
│   ├── blog/               # Blog section
│   │   ├── [slug].astro    # Individual blog posts
│   │   └── tags/           # Tag-based filtering
│   └── index.astro         # Homepage
├── app/blog/[id]/      # Additional blog routing
content/               # Local content files
├── *.md              # Markdown blog posts with frontmatter
├── tags.json         # Tag definitions
└── images/           # Blog images (moved to public/images)
scripts/
└── export-content.js # NEWT CMS content export script
public/
└── images/           # Static blog images
```

### Data Models

- **Article**: Blog posts with title, body, tags, thumbnails, and metadata
- **Tag**: Categorization system with name and slug
- **Environment**: Requires `NEWT_SPACE_UID` and `NEWT_CDN_API_TOKEN` for CMS integration

### Development Notes

- Biome configuration includes special rules for Astro files
- Uses TypeScript with path aliases (`@/*` maps to `./src/*`)
- Syntax highlighting via `react-syntax-highlighter`
- DOM manipulation with Cheerio for server-side processing
