/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-carousel-slide. Base: hero.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts hero carousel slide content from the hero featured slider.
 * Each slide has a 2-column layout: large image | text content (heading, description, CTA).
 *
 * Source DOM (from captured HTML):
 * - Slide container: reimagine-hero-featured-slider-item
 *   - Image: reimagine-media[slot="ui-shell-media"] picture img / img[slot="media__asset"]
 *   - Text: reimagine-layout-column[slot="ui-shell-header"]
 *     - Heading: reimagine-heading-block h1, h2
 *     - Description: div[slot="heading-block__content-text"]
 *     - CTA: reimagine-button-group reimagine-button a
 */
export default function parse(element, { document }) {
  // Image - look for picture element first, then fall back to img
  const picture = element.querySelector('reimagine-media[slot="ui-shell-media"] picture');
  const img = picture || element.querySelector('reimagine-media[slot="ui-shell-media"] img');

  // Heading - h1 or h2 inside heading block
  const heading = element.querySelector('reimagine-heading-block h1, reimagine-heading-block h2');

  // Description text - inside content-text slot
  const descriptionDiv = element.querySelector('div[slot="heading-block__content-text"]');
  const description = descriptionDiv ? descriptionDiv.querySelector('div') : null;

  // CTA links - from button group
  const ctaLinks = Array.from(
    element.querySelectorAll('reimagine-button-group reimagine-button a')
  );

  // Build cells: 2-column layout [image | text content]
  const imageCell = [];
  if (img) imageCell.push(img);

  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) {
    // Create a paragraph from the description text
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCell.push(p);
  }
  ctaLinks.forEach((link) => textCell.push(link));

  const cells = [];
  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel-slide', cells });
  element.replaceWith(block);
}
