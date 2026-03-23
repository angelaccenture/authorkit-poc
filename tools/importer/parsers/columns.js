/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns (Copilot Features section).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20, Updated: 2026-03-21
 *
 * Extracts the "How it works" / Copilot Features section as default content.
 * Original is an interactive accordion; simplified to flowing default content:
 * - Feature descriptions (h3 + p for each feature)
 * - Feature image
 *
 * No block is created — content becomes section default content.
 *
 * Source DOM (from cleaned.html):
 * - Container: div.ocr-accordion.accordion--vertical-product
 *   - Items: li.ocr-accordion-item (4 items)
 *     - Title: button.ocr-accordion-item__header h3
 *     - Body: div.ocr-accordion-item__body > div > div (text)
 *     - Image: div.ocr-accordion-item__body img
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li.ocr-accordion-item'));

  const wrapper = document.createElement('div');

  // Feature descriptions as default content
  items.forEach((item) => {
    const titleEl = item.querySelector('h3');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      wrapper.appendChild(h3);
    }

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
          wrapper.appendChild(p);
        }
      }
    }
  });

  // Feature image
  const firstImg = element.querySelector('.ocr-accordion-item__body img');
  if (firstImg) {
    wrapper.appendChild(firstImg);
  }

  element.replaceWith(wrapper);
}
