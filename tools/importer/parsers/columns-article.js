/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-article variant.
 * Base block: columns
 * Source: https://wknd-trendsetters.site
 * Source selector: main > section:first-of-type .grid-layout.grid-gap-lg
 * Extracts: 2-column layout - image left, breadcrumbs + heading + author + date right
 * Target: Columns block table (1 row, 2 columns)
 */
export default function parse(element, { document }) {
  // The grid-layout has 2 direct child divs: image column and text column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  if (columns.length < 2) {
    // Fallback: wrap entire content
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells: [[element]] });
    element.replaceWith(block);
    return;
  }

  // Column 1: Image from captured DOM: <img class="cover-image utility-aspect-3x2">
  const imageCol = columns[0];
  const image = imageCol.querySelector('img.cover-image, img');

  // Column 2: Text content from captured DOM
  const textCol = columns[1];

  // Extract breadcrumbs: <div class="breadcrumbs"> with <a> links
  const breadcrumbs = textCol.querySelector('.breadcrumbs');

  // Extract heading: <h2 class="h2-heading">
  const heading = textCol.querySelector('h2.h2-heading, h2');

  // Extract author info: "By Taylor Brooks" and date "June 12, 2024 • 4 min read"
  const authorName = textCol.querySelector('.utility-text-black, .paragraph-sm:not(.utility-text-secondary)');
  const dateInfo = textCol.querySelectorAll('.utility-margin-top-0-5rem .paragraph-sm, .flex-gap-xxs .paragraph-sm');

  // Build column 1 cell
  const col1 = [];
  if (image) col1.push(image);

  // Build column 2 cell
  const col2 = [];
  if (breadcrumbs) {
    // Clean breadcrumbs: keep text links, remove SVG separator icons
    const breadcrumbLinks = breadcrumbs.querySelectorAll('a');
    const breadcrumbP = document.createElement('p');
    breadcrumbLinks.forEach((link, idx) => {
      if (idx > 0) breadcrumbP.append(document.createTextNode(' > '));
      breadcrumbP.append(link);
    });
    col2.push(breadcrumbP);
  }
  if (heading) col2.push(heading);

  // Build author/date paragraph
  const metaP = document.createElement('p');
  const bySpan = textCol.querySelector('.utility-text-secondary');
  if (bySpan && authorName) {
    metaP.append(document.createTextNode('By '));
    const strong = document.createElement('strong');
    strong.textContent = authorName.textContent.trim();
    metaP.append(strong);
  }
  // Date info
  const dateContainer = textCol.querySelector('.utility-margin-top-0-5rem');
  if (dateContainer) {
    const dateSpans = dateContainer.querySelectorAll('.paragraph-sm');
    if (dateSpans.length > 0) {
      const dateP = document.createElement('p');
      dateSpans.forEach((span) => {
        dateP.append(document.createTextNode(span.textContent.trim() + ' '));
      });
      col2.push(dateP);
    }
  }
  if (metaP.childNodes.length > 0) col2.push(metaP);

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
