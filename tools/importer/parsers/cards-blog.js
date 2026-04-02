/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-blog. Base: cards.
 * Source: https://blogs.microsoft.com/
 * Generated: 2026-03-18
 *
 * Extracts article preview cards from section.featured-posts and section.recent-posts.
 * Each article has: optional thumbnail image, date/author meta text, linked title.
 * Maps to Cards block: col1 = image, col2 = meta text + title heading.
 *
 * Source DOM variations handled:
 * - Featured: <a class="f-post-link"><h3>...</h3></a> (link wraps heading)
 * - Recent: <h3><a class="f-post-link">...</a></h3> (heading wraps link)
 * - Some articles have no image (first featured article)
 * - Author may be a link or plain text
 */
export default function parse(element, { document }) {
  // element is an individual article.m-preview
  // Find the parent section/container to collect all sibling articles
  // Handles: blog homepage sections, blog article sidebar (aside#secondary)
  const section = element.closest('section.featured-posts, section.recent-posts, aside#secondary');
  if (!section) {
    element.remove();
    return;
  }

  const articles = Array.from(section.querySelectorAll('article.m-preview'));

  // Only the first article triggers block creation; subsequent ones are removed
  if (articles.indexOf(element) !== 0) {
    element.remove();
    return;
  }

  // Build cells - one row per article card
  const cells = [];

  articles.forEach((article) => {
    // Col 1: Image (from <a class="m-preview-image"> <img>)
    const img = article.querySelector('a.m-preview-image img, img.c-image.wp-post-image');
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Col 2: Text content (date/author line + linked title)
    const textCell = [];

    // Date and author meta text
    const metaText = article.querySelector('p.c-meta-text');
    if (metaText) {
      textCell.push(metaText);
    }

    // Title - handle both DOM patterns:
    // Featured: <a class="f-post-link"><h3>Title</h3></a>
    // Recent: <h3><a class="f-post-link">Title</a></h3>
    const titleH3 = article.querySelector('h3');
    if (titleH3) {
      textCell.push(titleH3);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);

  // Remove remaining articles (their content is already in the block)
  articles.slice(1).forEach((a) => a.remove());
}
