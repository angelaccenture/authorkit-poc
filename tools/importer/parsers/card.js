/* eslint-disable */
/* global WebImporter */

/**
 * Parser for card. Base: card (custom project block).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts individual cards from the News/Discover and Get Started sections.
 * Each card has image + badge + heading + description + CTA.
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
 * Element received: individual div.card (matched by selector)
 * Block structure: 2-column table (matches project card block)
 *   Row per card: [image | badge + heading + description + CTA]
 */
export default function parse(element, { document }) {
  const cardEl = element.classList.contains('card') ? element : element.querySelector('.card');
  if (!cardEl) {
    element.remove();
    return;
  }

  // Find the parent container that holds sibling cards
  const container = element.closest('.three-up-cards')
    || element.closest('.cta-stacked--vertical-cards');

  if (container) {
    // Collect all card elements in the container
    const allCards = Array.from(container.querySelectorAll('.three-up-cards__card .card, .card'));
    // Deduplicate (in case nested selectors match same element)
    const uniqueCards = [...new Set(allCards)];

    // Only the first card triggers block creation
    const myIndex = uniqueCards.indexOf(cardEl);
    if (myIndex > 0) {
      element.remove();
      return;
    }

    // First card: build block with all sibling cards
    const cells = [];
    const wrappers = Array.from(container.querySelectorAll('.three-up-cards__card'));
    wrappers.forEach((wrapper) => {
      const card = wrapper.querySelector('.card') || wrapper;
      cells.push(buildCardRow(card, document));
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'card', cells });
    element.replaceWith(block);

    // Remove remaining card wrappers
    wrappers.slice(1).forEach((w) => w.remove());
    return;
  }

  // Single card fallback
  const cells = [buildCardRow(cardEl, document)];
  const block = WebImporter.Blocks.createBlock(document, { name: 'card', cells });
  element.replaceWith(block);
}

function buildCardRow(card, document) {
  // Image
  const img = card.querySelector('.card__media img');
  const imageCell = [];
  if (img) imageCell.push(img);

  // Text content
  const textCell = [];

  // Badge (optional)
  const badgeEl = card.querySelector('.block-feature__label');
  if (badgeEl) {
    const badgeText = badgeEl.textContent.trim();
    if (badgeText) {
      const em = document.createElement('em');
      em.textContent = badgeText;
      textCell.push(em);
    }
  }

  // Heading (h3 or h4)
  const heading = card.querySelector('.block-feature__title h3, .block-feature__title h4');
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    textCell.push(h3);
  }

  // Description
  const descEl = card.querySelector('.block-feature__paragraph');
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
  const cta = card.querySelector('.action a.btn, .block-slim a.btn');
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href') || '';
    const btnText = cta.querySelector('.btn__text');
    a.textContent = (btnText ? btnText.textContent : cta.textContent).trim();
    p.appendChild(a);
    textCell.push(p);
  }

  return [imageCell, textCell];
}
