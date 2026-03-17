/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base block: cards
 * Source: https://wknd-trendsetters.site
 * Source selector: .section.secondary-section .grid-layout.desktop-4-column.grid-gap-md
 * Extracts: 4 article cards with image, category tag, date, title, and link
 * Target: Cards block table (N rows, 2 columns: image | text content)
 */
export default function parse(element, { document }) {
  // Extract article cards from captured DOM: <a class="article-card card-link">
  const articles = Array.from(element.querySelectorAll('a.article-card, a.card-link'));

  const cells = [];
  articles.forEach((article) => {
    // Image from captured DOM: <img class="cover-image"> inside .article-card-image
    const img = article.querySelector('.article-card-image img, img.cover-image, img');

    // Text content from captured DOM: .article-card-body
    const body = article.querySelector('.article-card-body');

    // Build text cell
    const textCell = [];

    if (body) {
      // Category tag from captured DOM: <span class="tag">
      const tag = body.querySelector('.tag, span.tag');
      if (tag) {
        const tagP = document.createElement('p');
        tagP.textContent = tag.textContent.trim();
        textCell.push(tagP);
      }

      // Date from captured DOM: <span class="paragraph-sm utility-text-secondary">
      const dateEl = body.querySelector('.article-card-meta .paragraph-sm.utility-text-secondary, .paragraph-sm.utility-text-secondary');
      if (dateEl) {
        const dateP = document.createElement('p');
        dateP.textContent = dateEl.textContent.trim();
        textCell.push(dateP);
      }

      // Title from captured DOM: <h3 class="h4-heading">
      const title = body.querySelector('h3, h4, [class*="heading"]');
      if (title) textCell.push(title);
    }

    // Add link to article
    const link = document.createElement('a');
    link.href = article.href || article.getAttribute('href') || '#';
    link.textContent = 'Read more';
    const linkP = document.createElement('p');
    linkP.append(link);
    textCell.push(linkP);

    // Row: image | text
    cells.push([img || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
