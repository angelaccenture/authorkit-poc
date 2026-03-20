/* eslint-disable */
/* global WebImporter */

/**
 * Parser for social-follow. Base: custom.
 * Sources:
 *   - https://www.microsoft.com/en-us (reimagine-logo-footer)
 *   - https://www.microsoft.com/en-us/microsoft-365 (div.socialfollow)
 * Generated: 2026-03-20
 *
 * Extracts social media follow links with icons from the footer section.
 * Handles two DOM patterns:
 *
 * Pattern 1 (Homepage): reimagine-logo-footer
 *   - Heading: reimagine-text-block h2
 *   - Social links: reimagine-link > a (with aria-label)
 *
 * Pattern 2 (M365): div.socialfollow
 *   - Heading: h2
 *   - Social links: ul.list-inline > li > a > img (alt = platform name)
 *
 * Block structure: 2-column table
 *   Row 1 (heading): heading text spans both columns
 *   Subsequent rows: [icon image | link with platform name]
 */
export default function parse(element, { document }) {
  // Detect which DOM pattern we have
  const isSocialFollow = element.classList.contains('socialfollow')
    || element.querySelector('.socialfollow');
  const logoFooter = element.querySelector('reimagine-logo-footer') || element;

  const cells = [];

  if (isSocialFollow) {
    // Pattern 2: M365 socialfollow
    const container = element.querySelector('.socialfollow') || element;
    const heading = container.querySelector('h2');

    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      cells.push([h2]);
    }

    const socialLinks = Array.from(container.querySelectorAll('ul.list-inline > li > a'));
    socialLinks.forEach((a) => {
      const img = a.querySelector('img');
      const href = a.href || a.getAttribute('href') || '';
      const platformName = img ? (img.alt || img.title || 'Link') : 'Link';

      const imageCell = [];
      if (img) imageCell.push(img);

      const link = document.createElement('a');
      link.href = href;
      link.textContent = platformName.replace(' logo', '');

      cells.push([imageCell, link]);
    });
  } else {
    // Pattern 1: Homepage reimagine-logo-footer
    const heading = logoFooter.querySelector(
      'h2[slot="text-block__heading"], reimagine-text-block h2, h2'
    );

    if (heading) {
      cells.push([heading]);
    }

    const reimagineLinks = Array.from(logoFooter.querySelectorAll('reimagine-link'));
    reimagineLinks.forEach((rl) => {
      const a = rl.querySelector('a');
      const img = rl.querySelector('img');

      if (!a) return;

      const href = a.href || a.getAttribute('href') || '';
      const ariaLabel = a.getAttribute('aria-label') || '';
      const platformMatch = ariaLabel.match(/on\s+(\w+)/i);
      const platformName = platformMatch ? platformMatch[1] : (img ? img.alt : 'Link');

      const imageCell = [];
      if (img) imageCell.push(img);

      const link = document.createElement('a');
      link.href = href;
      link.textContent = platformName;

      cells.push([imageCell, link]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'social-follow', cells });
  element.replaceWith(block);
}
