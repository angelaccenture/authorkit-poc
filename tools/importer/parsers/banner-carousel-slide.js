/* eslint-disable */
/* global WebImporter */

/**
 * Parser for banner-carousel-slide. Base: hero.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts banner-style carousel slides from the bottom carousel.
 * Each slide has a full-width background image with overlaid text content.
 * Similar to Hero block structure but designed for use inside advanced-carousel.
 *
 * Source DOM (from captured HTML / live page inspection):
 * - Slide container: reimagine-carousel-item > reimagine-card-banner
 *   - Image: reimagine-media[slot="card-banner__media"] img[slot="media__asset"]
 *   - Content body: reimagine-text-block[slot="card-banner__content-body"]
 *     - Heading: h2[slot="text-block__heading"]
 *     - Description: p[slot="text-block__content"]
 *   - CTA: reimagine-button-group[slot="card-banner__content-footer-bottom"] reimagine-button a
 *
 * Block structure: 1-column table (similar to Hero)
 *   Row 1: background image
 *   Row 2: heading + description + CTA
 */
export default function parse(element, { document }) {
  // Find the card-banner inside the carousel item
  const cardBanner = element.querySelector('reimagine-card-banner') || element;

  // Image
  const picture = cardBanner.querySelector('reimagine-media picture');
  const img = picture || cardBanner.querySelector('reimagine-media img');

  // Heading - check both reimagine-text-block and reimagine-heading-block patterns
  const heading = cardBanner.querySelector(
    'h2[slot="text-block__heading"], ' +
    'reimagine-text-block h2, ' +
    'reimagine-heading-block h2, ' +
    'h2'
  );

  // Description - check both text-block and heading-block patterns
  const descEl = cardBanner.querySelector(
    'p[slot="text-block__content"], ' +
    'reimagine-text-block p'
  );
  const descText = descEl ? descEl.textContent.trim() : '';

  // Fallback: try heading-block content-text div
  const descDiv = !descText
    ? cardBanner.querySelector('div[slot="heading-block__content-text"]')
    : null;
  const fallbackDescText = descDiv ? descDiv.textContent.trim() : '';
  const finalDescText = descText || fallbackDescText;

  // CTA links
  const ctaLinks = Array.from(
    cardBanner.querySelectorAll('reimagine-button-group reimagine-button a')
  );

  const cells = [];

  // Row 1: Image
  if (img) {
    cells.push([img]);
  }

  // Row 2: Text content (heading + description + CTAs) in a single cell
  const textCell = [];
  if (heading) textCell.push(heading);
  if (finalDescText) {
    const p = document.createElement('p');
    p.textContent = finalDescText;
    textCell.push(p);
  }
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    textCell.push(p);
  });

  if (textCell.length > 0) {
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-carousel-slide', cells });
  element.replaceWith(block);
}
