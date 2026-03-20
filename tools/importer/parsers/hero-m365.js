/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-m365. Base: hero.
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts the centered hero with background image, eyebrow, h1, subtitle, 2 CTAs.
 * Different DOM from homepage hero (uses section-master--bg-image, not reimagine-banner-featured).
 *
 * Source DOM (from cleaned.html):
 * - Container: div.section-master--bg-image.section-master--blade-hero-slim
 *   - Background image: div.section-master__image img
 *   - Eyebrow: div.block-heading__eyebrow
 *   - Heading: h1 > span
 *   - Description: div.block-heading__paragraph
 *   - CTAs: div.block-heading__button-group a.btn
 *
 * Block structure: 1-column table (matches Block Collection Hero)
 *   Row 1: background image
 *   Row 2: eyebrow + heading + description + CTAs
 */
export default function parse(element, { document }) {
  // Background image
  const bgImg = element.querySelector('div.section-master__image img');

  // Eyebrow text
  const eyebrowEl = element.querySelector('.block-heading__eyebrow');
  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';

  // Heading (h1)
  const h1 = element.querySelector('h1');
  const headingText = h1 ? h1.textContent.trim() : '';

  // Description paragraph
  const descEl = element.querySelector('.block-heading__paragraph');
  // Get the inner text, stripping sup footnote refs
  let descText = '';
  if (descEl) {
    const descDiv = descEl.querySelector('div > div');
    if (descDiv) {
      // Clone to avoid modifying DOM, strip footnote sups
      const clone = descDiv.cloneNode(true);
      clone.querySelectorAll('sup').forEach((s) => s.remove());
      descText = clone.textContent.trim();
    }
  }

  // CTA buttons
  const ctaLinks = Array.from(
    element.querySelectorAll('.block-heading__button-group a.btn')
  );

  const cells = [];

  // Row 1: Background image
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: Text content
  const textCell = [];

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.textContent = eyebrowText;
    textCell.push(eyebrow);
  }

  if (headingText) {
    const heading = document.createElement('h1');
    heading.textContent = headingText;
    textCell.push(heading);
  }

  if (descText) {
    const p = document.createElement('p');
    p.textContent = descText;
    textCell.push(p);
  }

  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    const btnText = link.querySelector('.btn__text');
    a.textContent = (btnText ? btnText.textContent : link.textContent).trim();
    p.appendChild(a);
    textCell.push(p);
  });

  if (textCell.length > 0) {
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-m365', cells });
  element.replaceWith(block);
}
