/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery variant.
 * Base block: cards
 * Source: https://wknd-trendsetters.site
 * Source selector: .section.secondary-section .grid-layout.desktop-4-column.grid-gap-sm
 * Extracts: 8 square images in a 4x2 grid (image-only cards)
 * Target: Cards block table (N rows, 2 columns: image | empty)
 */
export default function parse(element, { document }) {
  // Extract image items from captured DOM: <div class="utility-aspect-1x1"> containing <img class="cover-image">
  const imageItems = Array.from(element.querySelectorAll('.utility-aspect-1x1, :scope > div'));

  const cells = [];
  imageItems.forEach((item) => {
    const img = item.querySelector('img.cover-image, img');
    if (img) {
      // Cards block: image in first cell, empty second cell for image-only cards
      cells.push([img, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
