/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-store. Base: hero.
 * Source: https://www.microsoft.com/en-us/store/configure/surface-laptop-13-inch/8mzbmmcjzqv3
 * Generated: 2026-04-08
 *
 * Extracts product hero from Microsoft Store configurator pages.
 * Source DOM (from captured HTML / browser snapshot):
 * - Main image: img.img-fluid.configuratorV35-hero-image-display
 * - Thumbnails: div.configuratorV35-thumbnails img
 * - Title (h1): h1.configuratorV35-title
 * - Product name: h3.sticky-bar-v35-title
 * - Price: div.sticky-bar-price-v35 h3
 * - Cross-sell links: p with links to other sizes
 * - Trust badges: div with "Why buy from Microsoft" text
 *
 * Block structure: hero (Block Collection)
 *   Row 1: product image
 *   Row 2: heading + description + CTA
 */
export default function parse(element, { document }) {
  // Main product image
  const mainImg = element.querySelector('img.configuratorV35-hero-image-display, img.img-fluid[alt*="Surface"]');

  // Product title from h1 or sticky bar
  const h1 = element.querySelector('h1.configuratorV35-title, h1');
  const productName = element.querySelector('h3.sticky-bar-v35-title, h3.h6');

  // Price
  const priceEl = element.querySelector('.sticky-bar-price-v35 h3, [class*="price"] h3');

  // Cross-sell links (other sizes)
  const crossSellLinks = Array.from(element.querySelectorAll('a[href*="configure"]')).filter(
    (a) => a.textContent.match(/\d+-inch/i)
  );

  const cells = [];

  // Row 1: Product image
  if (mainImg) {
    cells.push([mainImg]);
  }

  // Row 2: Text content
  const textCell = [];

  if (h1) textCell.push(h1);

  if (productName && productName.textContent !== h1?.textContent) {
    const h2 = document.createElement('h2');
    h2.textContent = productName.textContent.trim();
    textCell.push(h2);
  }

  if (priceEl) {
    const p = document.createElement('p');
    p.textContent = priceEl.textContent.trim();
    textCell.push(p);
  }

  if (crossSellLinks.length > 0) {
    const p = document.createElement('p');
    p.textContent = 'Also available: ';
    crossSellLinks.forEach((link, i) => {
      if (i > 0) p.append(', ');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
    });
    textCell.push(p);
  }

  if (textCell.length > 0) {
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
