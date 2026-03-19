/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards. Base: cards (Block Collection).
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts card grids from reimagine-featured sections.
 * Used in 3 sections: Content Promotion Cards (4 cards), For Business (4 cards),
 * Get to Know AI (3 cards).
 *
 * Source DOM (from captured HTML):
 * - Container: div.featured > reimagine-featured
 *   - Each card: reimagine-card-feature
 *     - Image: reimagine-media img[slot="media__asset"], reimagine-media picture
 *     - Badge (optional): reimagine-tag span (e.g., "Gaming", "Now available with 5G")
 *     - Heading: reimagine-text-block h2[slot="text-block__heading"],
 *               reimagine-text-block h3[slot="text-block__heading"]
 *     - Description: reimagine-text-block p[slot="text-block__content"]
 *     - CTA: reimagine-button a[slot="card-feature__content-footer-bottom"],
 *            reimagine-button a
 *
 * Block structure: 2-column table matching Block Collection Cards
 *   Each row: [image | text content (optional badge + heading + description + CTA)]
 */
export default function parse(element, { document }) {
  // element is a single reimagine-card-feature
  // Find the parent featured container to collect all sibling cards
  const featured = element.closest('reimagine-featured');
  if (!featured) {
    // Fallback: just parse this single card
    const cells = [buildCardRow(element, document)];
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
    return;
  }

  const allCards = Array.from(featured.querySelectorAll('reimagine-card-feature'));

  // Only the first card triggers block creation; subsequent ones are removed
  if (allCards.indexOf(element) !== 0) {
    element.remove();
    return;
  }

  // Build cells - one row per card
  const cells = [];
  allCards.forEach((card) => {
    cells.push(buildCardRow(card, document));
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);

  // Remove remaining cards (their content is already in the block)
  allCards.slice(1).forEach((card) => card.remove());
}

function buildCardRow(card, document) {
  // Col 1: Image
  const picture = card.querySelector('reimagine-media picture');
  const img = picture || card.querySelector('reimagine-media img');
  const imageCell = [];
  if (img) imageCell.push(img);

  // Col 2: Text content
  const textCell = [];

  // Optional badge (e.g., "Gaming", "Now available with 5G")
  const tag = card.querySelector('reimagine-tag');
  if (tag) {
    const badgeText = tag.textContent.trim();
    if (badgeText) {
      const em = document.createElement('em');
      em.textContent = badgeText;
      textCell.push(em);
    }
  }

  // Heading
  const heading = card.querySelector(
    'reimagine-text-block h2[slot="text-block__heading"], ' +
    'reimagine-text-block h3[slot="text-block__heading"], ' +
    'reimagine-text-block h2, reimagine-text-block h3'
  );
  if (heading) textCell.push(heading);

  // Description
  const desc = card.querySelector(
    'reimagine-text-block p[slot="text-block__content"], ' +
    'reimagine-text-block p'
  );
  if (desc) textCell.push(desc);

  // CTA link
  const cta = card.querySelector(
    'reimagine-button a'
  );
  if (cta) {
    const link = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href') || '';
    a.textContent = cta.textContent.trim();
    link.appendChild(a);
    textCell.push(link);
  }

  return [imageCell, textCell];
}
