/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing variant.
 * Base block: hero
 * Source: https://wknd-trendsetters.site
 * Source selector: header.secondary-section
 * Extracts: H1 heading, subheading, 2 CTAs, 3 grid images
 * Target: Hero block table (row 1: images, row 2: heading + text + CTAs)
 */
export default function parse(element, { document }) {
  // Extract heading from captured DOM: <h1 class="h1-heading">
  const heading = element.querySelector('h1.h1-heading, h1, h2');

  // Extract subheading from captured DOM: <p class="subheading">
  const subheading = element.querySelector('p.subheading, p');

  // Extract CTAs from captured DOM: <a class="button"> and <a class="button secondary-button">
  const ctas = Array.from(element.querySelectorAll('.button-group a.button'));

  // Extract grid images from captured DOM: <img class="cover-image"> inside the image grid
  const images = Array.from(element.querySelectorAll('.grid-layout .cover-image, .grid-layout img'));

  // Row 1: Images (media row)
  const imageCell = [];
  images.forEach((img) => imageCell.push(img));

  // Row 2: Content (heading + subheading + CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);

  const cells = [];
  if (imageCell.length > 0) cells.push(imageCell);
  if (contentCell.length > 0) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
