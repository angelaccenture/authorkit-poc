/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns. Base: columns (Block Collection).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts the "How it works" / Copilot Features section.
 * Original is an interactive accordion; simplified to a static two-column layout:
 * - Left column: Feature descriptions (h3 + p for each feature)
 * - Right column: First feature image
 *
 * Source DOM (from cleaned.html):
 * - Container: div.ocr-accordion.accordion--vertical-product
 *   - Items: li.ocr-accordion-item (4 items)
 *     - Title: button.ocr-accordion-item__header h3
 *     - Body: div.ocr-accordion-item__body > div > div (text)
 *     - Image: div.ocr-accordion-item__body img
 *
 * Block structure: 2-column table (matches Block Collection Columns)
 *   Row 1: [feature descriptions (h3 + p per feature) | feature image]
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li.ocr-accordion-item'));

  // Left column: feature descriptions
  const leftCell = [];

  items.forEach((item) => {
    // Title
    const titleEl = item.querySelector('h3');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      leftCell.push(h3);
    }

    // Description text
    const bodyEl = item.querySelector('.ocr-accordion-item__body');
    if (bodyEl) {
      const textDiv = bodyEl.querySelector('div > div');
      if (textDiv) {
        const clone = textDiv.cloneNode(true);
        clone.querySelectorAll('sup').forEach((s) => s.remove());
        const text = clone.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          leftCell.push(p);
        }
      }
    }
  });

  // Right column: first feature image
  const rightCell = [];
  const firstImg = element.querySelector('.ocr-accordion-item__body img');
  if (firstImg) {
    rightCell.push(firstImg);
  }

  const cells = [];
  cells.push([leftCell, rightCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
