/* eslint-disable */
/* global WebImporter */

/**
 * Parser for advanced-accordion. Base: advanced-accordion (FAQ variant).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts FAQ items from the FAQ section of the M365 page.
 * Each FAQ has a numbered label, question (h3), and answer body.
 *
 * Source DOM (from cleaned.html):
 * - Container: div.ocr-faq
 *   - Header: div.ocr-faq__header > div.ocr-faq__title > h2
 *   - FAQ list: ul.accordion > li.ocr-faq-item (×7)
 *     - Question: div.ocr-faq-item__header--title h3 > span
 *     - Answer: div.ocr-faq-item__body > div > div (may contain links)
 *
 * Block structure: advanced-accordion container block
 *   Block table: single row with list of FAQ titles
 *   Followed by section breaks + content for each FAQ item
 */
export default function parse(element, { document }) {
  const faqContainer = element.querySelector('.ocr-faq') || element;

  // Collect FAQ items
  const faqItems = Array.from(faqContainer.querySelectorAll('li.ocr-faq-item'));

  // Build the accordion navigation list (titles for each item)
  const ul = document.createElement('ul');

  faqItems.forEach((item) => {
    const titleEl = item.querySelector('.ocr-faq-item__header--title h3');
    if (titleEl) {
      const li = document.createElement('li');
      li.textContent = titleEl.textContent.trim();
      ul.appendChild(li);
    }
  });

  // Advanced-accordion block: single row with the list of titles
  const cells = [[ul]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'advanced-accordion', cells });

  // Wrap everything in a container div
  const wrapper = document.createElement('div');
  wrapper.appendChild(block);

  // Add FAQ content as sections after the block
  faqItems.forEach((item) => {
    const titleEl = item.querySelector('.ocr-faq-item__header--title h3');
    const bodyEl = item.querySelector('.ocr-faq-item__body');

    if (!titleEl) return;

    // Section break
    wrapper.appendChild(document.createElement('hr'));

    // Question as h3
    const h3 = document.createElement('h3');
    h3.textContent = titleEl.textContent.trim();
    wrapper.appendChild(h3);

    // Answer
    if (bodyEl) {
      const answerDiv = bodyEl.querySelector('div > div') || bodyEl;
      const clone = answerDiv.cloneNode(true);
      clone.querySelectorAll('style, script, link').forEach((el) => el.remove());

      // Build answer paragraph preserving links
      const p = document.createElement('p');
      clone.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          const text = node.textContent;
          if (text.trim()) p.appendChild(document.createTextNode(text));
        } else if (node.nodeName === 'A') {
          const a = document.createElement('a');
          a.href = node.href || node.getAttribute('href') || '';
          a.textContent = node.textContent.trim();
          p.appendChild(a);
        } else {
          const text = node.textContent;
          if (text.trim()) p.appendChild(document.createTextNode(text));
        }
      });

      if (p.textContent.trim()) {
        wrapper.appendChild(p);
      }
    }
  });

  element.replaceWith(wrapper);
}
