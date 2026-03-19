/* eslint-disable */
/* global WebImporter */

/**
 * Parser for social-follow. Base: custom.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts social media follow links with icons from the logo-footer section.
 *
 * Source DOM (from live page inspection):
 * - Container: reimagine-logo-footer
 *   - Heading: reimagine-text-block[slot="header"] h2[slot="text-block__heading"]
 *   - Social links: reimagine-link > a (with aria-label like "Follow Microsoft on Facebook")
 *     - Icon: reimagine-link img[slot="media__asset"] (social icon images)
 *     - Link href and aria-label provide platform name and URL
 *
 * Block structure: 2-column table
 *   Row 1 (heading): heading text spans both columns
 *   Subsequent rows: [icon image | link with platform name]
 */
export default function parse(element, { document }) {
  // Find the reimagine-logo-footer element
  const logoFooter = element.querySelector('reimagine-logo-footer') || element;

  // Heading
  const heading = logoFooter.querySelector(
    'h2[slot="text-block__heading"], reimagine-text-block h2, h2'
  );

  // Social links - get the reimagine-link elements which contain both icon and link
  const reimagineLinks = Array.from(logoFooter.querySelectorAll('reimagine-link'));

  const cells = [];

  // First row: heading (if present)
  if (heading) {
    cells.push([heading]);
  }

  // Each social link: [icon | link text]
  reimagineLinks.forEach((rl) => {
    const a = rl.querySelector('a');
    const img = rl.querySelector('img');

    if (!a) return;

    const href = a.href || a.getAttribute('href') || '';
    const ariaLabel = a.getAttribute('aria-label') || '';
    // Extract platform name from aria-label (e.g., "Follow Microsoft on Facebook, opens in a new tab" -> "Facebook")
    const platformMatch = ariaLabel.match(/on\s+(\w+)/i);
    const platformName = platformMatch ? platformMatch[1] : (img ? img.alt : 'Link');

    // Col 1: Icon image
    const imageCell = [];
    if (img) imageCell.push(img);

    // Col 2: Link with platform name
    const link = document.createElement('a');
    link.href = href;
    link.textContent = platformName;

    cells.push([imageCell, link]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'social-follow', cells });
  element.replaceWith(block);
}
