/* eslint-disable */
/* global WebImporter */

/**
 * Parser for teaser. Base: teaser (custom project block).
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts the large featured teaser card from the News/Discover section.
 * Horizontal card with image + badge + heading + description + CTA.
 *
 * Source DOM (from cleaned.html):
 * - Container: div.card-horizontal-container
 *   - Image: div.card-horizontal__media img
 *   - Badge: div.block-feature__label (e.g., "Limited-time offer")
 *   - Heading: h3 inside block-feature__title
 *   - Description: div.block-feature__paragraph
 *   - CTA: a.btn inside div.action
 *
 * Block structure: 2-row table (matches project teaser block)
 *   Row 1: image
 *   Row 2: badge + heading + description + CTA
 */
export default function parse(element, { document }) {
  const cardH = element.querySelector('.card-horizontal') || element;

  // Image
  const img = cardH.querySelector('.card-horizontal__media img');

  // Badge text (e.g., "Limited-time offer")
  const badgeEl = cardH.querySelector('.block-feature__label');
  const badgeText = badgeEl ? badgeEl.textContent.trim() : '';

  // Heading
  const headingEl = cardH.querySelector('.block-feature__title h3');
  const headingText = headingEl ? headingEl.textContent.trim() : '';

  // Description
  const descEl = cardH.querySelector('.block-feature__paragraph');
  let descText = '';
  if (descEl) {
    const clone = descEl.cloneNode(true);
    clone.querySelectorAll('sup').forEach((s) => s.remove());
    descText = clone.textContent.trim();
  }

  // CTA
  const ctaEl = cardH.querySelector('.action a.btn, .block-slim a.btn');

  const cells = [];

  // Row 1: Image
  if (img) {
    cells.push([img]);
  }

  // Row 2: Text content
  const textCell = [];

  if (badgeText) {
    const badge = document.createElement('em');
    badge.textContent = badgeText;
    textCell.push(badge);
  }

  if (headingText) {
    const h3 = document.createElement('h3');
    h3.textContent = headingText;
    textCell.push(h3);
  }

  if (descText) {
    const p = document.createElement('p');
    p.textContent = descText;
    textCell.push(p);
  }

  if (ctaEl) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaEl.href || ctaEl.getAttribute('href') || '';
    const btnText = ctaEl.querySelector('.btn__text');
    a.textContent = (btnText ? btnText.textContent : ctaEl.textContent).trim();
    p.appendChild(a);
    textCell.push(p);
  }

  if (textCell.length > 0) {
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser', cells });
  element.replaceWith(block);
}
