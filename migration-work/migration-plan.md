# Migration Plan: Microsoft Homepage

**Mode:** Single Page
**Source:** https://www.microsoft.com/en-us
**Target:** content/msft-homepage.plain.html
**Generated:** 2026-03-18

## Special Requirements
- Use `advanced-carousel` block for all carousels
- Create custom blocks for carousel slide content
- Target existing msft-homepage page

## Steps
- [x] 0. Initialize Migration Plan
- [x] 1. Project Setup
- [x] 2. Site Analysis (1 template: msft-homepage)
- [x] 3. Page Analysis (10 sections, 8 blocks, 5 new custom blocks created)
- [x] 4. Block Mapping (8 blocks mapped, 10 sections with selectors)
- [x] 5. Import Infrastructure (8 parsers, 2 transformers)
- [x] 6. Content Import (1 page: msft-homepage.plain.html)

## Blocks
### Existing (reused)
- `advanced-carousel` - Section-level carousel wrapper
- `hero` - Full-width promotional banner
- `cards` - Card grids (3 instances)

### New (created)
- `hero-carousel-slide` - Hero carousel slide (image + text)
- `banner-carousel-slide` - Banner carousel slide (bg image + overlay)
- `ai-chat` - AI assistant chat widget
- `quick-links` - Product category navigation links
- `social-follow` - Social media follow icons

## Artifacts
- `.migration/project.json` - DA project config
- `migration-work/authoring-analysis.json` - Page analysis
- `migration-work/cleaned.html` - Sanitized source HTML
- `migration-work/screenshot.png` - Visual reference
- `tools/importer/page-templates.json` - Templates with block mappings
- `tools/importer/parsers/*.js` - 8 block parsers
- `tools/importer/transformers/*.js` - 2 transformers
- `tools/importer/import-msft-homepage.js` - Import script
- `tools/importer/import-msft-homepage.bundle.js` - Bundled import script
- `content/msft-homepage.plain.html` - Imported content
- `blocks/hero-carousel-slide/` - New block (JS, CSS, metadata)
- `blocks/banner-carousel-slide/` - New block (JS, CSS, metadata)
- `blocks/ai-chat/` - New block (JS, CSS, metadata)
- `blocks/quick-links/` - New block (JS, CSS, metadata)
- `blocks/social-follow/` - New block (JS, CSS, metadata)

## Previous Migration (kept)
- Blog homepage: blogs.microsoft.com → index.plain.html (completed)
