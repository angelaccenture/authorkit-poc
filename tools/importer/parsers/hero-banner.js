/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://wknd-trendsetters.site
 * Source selector: section.inverse-section
 * Extracts: background image, H2 heading, subheading paragraph, CTA button
 * Target: Hero block table (row 1: background image, row 2: heading + text + CTA)
 */
export default function parse(element, { document }) {
  // Extract background image from captured DOM: <img class="cover-image utility-overlay">
  const bgImage = element.querySelector('img.cover-image');

  // Extract heading from captured DOM: <h2 class="h1-heading"> inside .card-body
  const heading = element.querySelector('.card-body h2, .card-body h1, h2.h1-heading');

  // Extract subheading from captured DOM: <p class="subheading"> inside .card-body
  const subheading = element.querySelector('.card-body p.subheading, .card-body p');

  // Extract CTA from captured DOM: <a class="button inverse-button"> inside .card-body
  const cta = element.querySelector('.card-body a.button, .card-body .button-group a');

  // Row 1: Background image
  const cells = [];
  if (bgImage) cells.push([bgImage]);

  // Row 2: Content (heading + subheading + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);
  if (contentCell.length > 0) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
