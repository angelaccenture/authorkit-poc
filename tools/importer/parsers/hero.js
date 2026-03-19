/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero. Base: hero (Block Collection).
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts the full-width promotional banner (Xbox Series X promo).
 * Matches the Block Collection Hero: 1-column table with image row + text row.
 *
 * Source DOM (from captured HTML):
 * - Container: reimagine-banner-featured > reimagine-card-banner
 *   - Image: reimagine-media[slot="card-banner__media"] img
 *   - Heading: reimagine-heading-block h2[slot="heading-block__heading-text"]
 *   - Description: div[slot="heading-block__content-text"]
 *   - CTA: reimagine-button-group reimagine-button a
 *
 * Block structure: 1-column table (matches Block Collection Hero)
 *   Row 1: background image
 *   Row 2: heading + description + CTA
 */
export default function parse(element, { document }) {
  // Find the card-banner inside the banner-featured container
  const cardBanner = element.querySelector('reimagine-card-banner') || element;

  // Image
  const picture = cardBanner.querySelector('reimagine-media picture');
  const img = picture || cardBanner.querySelector('reimagine-media img');

  // Heading
  const heading = cardBanner.querySelector(
    'reimagine-heading-block h2, reimagine-heading-block h1'
  );

  // Description
  const descDiv = cardBanner.querySelector('div[slot="heading-block__content-text"]');
  const descText = descDiv ? descDiv.textContent.trim() : '';

  // CTA links
  const ctaLinks = Array.from(
    cardBanner.querySelectorAll('reimagine-button-group reimagine-button a')
  );

  const cells = [];

  // Row 1: Image
  if (img) {
    cells.push([img]);
  }

  // Row 2: Text content (heading + description + CTAs)
  const textCell = [];
  if (heading) textCell.push(heading);
  if (descText) {
    const p = document.createElement('p');
    p.textContent = descText;
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
