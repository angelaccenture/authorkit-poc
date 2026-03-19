/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quick-links. Base: custom.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts the horizontal icon+text navigation links for product categories.
 *
 * Source DOM (from captured HTML):
 * - Container: reimagine-secondary-nav[configuration="quicklinks"]
 *   - Each link: reimagine-secondary-nav-item[configuration="quicklink"]
 *     - Text: enlabeltext attribute or textContent
 *     - Href: href attribute
 *     - Icon: SVG icon inside the element (not easily extractable as image)
 *
 * Block structure: 1-column table
 *   Each row: link text with href (icon will be handled by block rendering)
 */
export default function parse(element, { document }) {
  // Find all quicklink nav items
  const navItems = Array.from(
    element.querySelectorAll('reimagine-secondary-nav-item[configuration="quicklink"], reimagine-secondary-nav-item')
  );

  const cells = [];

  navItems.forEach((item) => {
    const href = item.getAttribute('href') || '';
    const labelText = item.getAttribute('enlabeltext') || item.textContent.trim();

    if (href && labelText) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = labelText;
      cells.push([link]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'quick-links', cells });
  element.replaceWith(block);
}
