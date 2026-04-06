/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-quote block.
 * Source: https://developer.microsoft.com/en-us/
 * Targets: developer story section with quote, product links, and video.
 *
 * Source DOM: section with h2, blockquote/paragraphs, product link list, video thumbnail
 * Output: 2-row block — row 1: quote text + product links, row 2: video thumbnail
 */
export default function parse(element, { document }) {
  // Extract quote heading
  const heading = element.querySelector('h2');

  // Extract quote paragraphs (the main quote text and attribution)
  const paragraphs = element.querySelectorAll('p');

  // Extract product links list
  const productList = element.querySelector('ul, ol');

  // Extract video thumbnail
  const videoThumb = element.querySelector('img[src*="video"], img[src*="thumbnail"], img[src*="story"]');
  const videoLink = element.querySelector('a[href*="youtube"], a[href*="video"], button[data-href]');

  // Build cells
  const cells = [];

  // Row 1: Quote content (heading + paragraphs + product links)
  const quoteContent = [];
  if (heading) quoteContent.push(heading);
  paragraphs.forEach((p) => quoteContent.push(p));
  if (productList) quoteContent.push(productList);
  cells.push([quoteContent]);

  // Row 2: Video thumbnail
  const videoContent = [];
  if (videoThumb) videoContent.push(videoThumb);
  if (videoLink) {
    const link = document.createElement('a');
    link.href = videoLink.href || videoLink.dataset.href || '#';
    link.textContent = 'Watch video';
    videoContent.push(link);
  }
  if (videoContent.length > 0) {
    cells.push([videoContent]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-quote', cells });
  element.replaceWith(block);
}
