/* eslint-disable */
/* global WebImporter */

/**
 * Parser for card-app. Base: card (variant: app).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts the "What's Included" app cards grid.
 * Each app card has an icon, app name, description, and "Learn more" link.
 * Only extracts the "Top picks" tab (first visible tab panel).
 *
 * Source DOM (from cleaned.html):
 * - Container: div.card-grid__cards > div.layout > div.layout__col > div.card
 *   - Icon: div.block-feature__badge img
 *   - Name: div.block-feature__title h4 (inside block-feature__body > block-feature__headings)
 *   - Description: div.block-feature__paragraph (inside block-feature__body)
 *   - Link: a.link-inline or a.link (inside block-slim > action)
 *
 * Element received: individual div.card (matched by selector)
 * Block structure: 2-column table (card variant)
 *   Each row: [icon image | app name + description + learn more link]
 */
export default function parse(element, { document }) {
  const cardEl = element.classList.contains('card') ? element : element.querySelector('.card');
  if (!cardEl) {
    element.remove();
    return;
  }

  // Only process cards from the first (active) tab panel
  const tabPanel = element.closest('.tab-panel');
  if (tabPanel && !tabPanel.classList.contains('active')) {
    element.remove();
    return;
  }

  // Find parent container to group all cards into one block
  const cardsContainer = element.closest('.card-grid__cards');
  if (cardsContainer) {
    const allCards = Array.from(cardsContainer.querySelectorAll('.layout__col > .card'));
    const myIndex = allCards.indexOf(cardEl);

    // Only the first card triggers block creation
    if (myIndex > 0) {
      element.remove();
      return;
    }

    // First card: build block with all sibling cards
    const cells = [];
    allCards.forEach((card) => {
      cells.push(buildAppCardRow(card, document));
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'card-app', cells });
    element.replaceWith(block);

    // Remove remaining card elements
    allCards.slice(1).forEach((c) => {
      const wrapper = c.closest('.layout__col');
      if (wrapper) wrapper.remove();
      else c.remove();
    });
    return;
  }

  // Single card fallback
  const cells = [buildAppCardRow(cardEl, document)];
  const block = WebImporter.Blocks.createBlock(document, { name: 'card-app', cells });
  element.replaceWith(block);
}

function buildAppCardRow(card, document) {
  // Icon image
  const icon = card.querySelector('.block-feature__badge img');
  const imageCell = [];
  if (icon) imageCell.push(icon);

  // Text content
  const textCell = [];

  // App name (h4)
  const nameEl = card.querySelector('.block-feature__title h4');
  if (nameEl) {
    const h3 = document.createElement('h3');
    h3.textContent = nameEl.textContent.trim();
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

  // Learn more link
  const linkEl = card.querySelector('.action a.link, .action a.link-inline');
  if (linkEl) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = linkEl.href || linkEl.getAttribute('href') || '';
    const linkText = linkEl.querySelector('.link__text');
    a.textContent = (linkText ? linkText.textContent : linkEl.textContent).trim();
    p.appendChild(a);
    textCell.push(p);
  }

  return [imageCell, textCell];
}
