/* eslint-disable */
/* global WebImporter */

/**
 * Parser for card. Base: card (custom project block).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20, Updated: 2026-03-23
 *
 * Extracts individual cards from the News/Discover and Get Started sections.
 * Each card has image + badge + heading + description + CTA.
 * Each .card element is matched individually by the selector, so this parser
 * creates exactly one card block per invocation.
 *
 * Source DOM (from cleaned.html):
 * News section: div.cta-stacked--vertical-cards div.three-up-cards__card div.card
 * Get Started section: div.three-up-cards__card div.card
 *   - Image: div.card__media img
 *   - Badge (optional): div.block-feature__label (e.g., "Blog", "Copilot")
 *   - Heading: div.block-feature__title h4 or h3
 *   - Description: div.block-feature__paragraph
 *   - CTA: div.action a.btn or div.block-slim a.btn
 *
 * Block structure: Single-row card block: [image | badge + heading + description + CTA]
 */
export default function parse(element, { document }) {
  const cardEl = element.classList.contains('card') ? element : element.querySelector('.card');
  if (!cardEl) {
    element.remove();
    return;
  }

  // Image
  const img = cardEl.querySelector('.card__media img');
  const imageCell = [];
  if (img) imageCell.push(img);

  // Text content
  const textCell = [];

  // Badge (optional)
  const badgeEl = cardEl.querySelector('.block-feature__label');
  if (badgeEl) {
    const badgeText = badgeEl.textContent.trim();
    if (badgeText) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = badgeText;
      p.appendChild(em);
      textCell.push(p);
    }
  }

  // Heading (h3 or h4)
  const heading = cardEl.querySelector('.block-feature__title h3, .block-feature__title h4');
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    textCell.push(h3);
  }

  // Description
  const descEl = cardEl.querySelector('.block-feature__paragraph');
  if (descEl) {
    const clone = descEl.cloneNode(true);
    clone.querySelectorAll('sup').forEach((s) => s.remove());
    const text = clone.textContent.trim();
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      textCell.push(p);
    }
  }

  // CTA
  const cta = cardEl.querySelector('.action a.btn, .block-slim a.btn');
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href') || '';
    const btnText = cta.querySelector('.btn__text');
    a.textContent = (btnText ? btnText.textContent : cta.textContent).trim();
    p.appendChild(a);
    textCell.push(p);
  }

  const cells = [[imageCell, textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'card', cells });
  element.replaceWith(block);
}
