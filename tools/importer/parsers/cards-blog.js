/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-blog.
 * Base: cards. Source: https://blogs.microsoft.com
 * Unified parser for both Featured and More News article sections.
 *
 * Source DOM structure (both sections share article.m-preview pattern):
 *   section.featured-posts / section.recent-posts
 *     h2 (section heading)
 *     article.m-preview (×N)
 *       [optional] a.m-preview-image > img
 *       div.m-preview-content
 *         p.c-meta-text > time > abbr[title], author (link or text)
 *         h3 > a.f-post-link (title)
 *     [optional] a.f-view-more "View More" link (news section only)
 *
 * Target cards table: Row per card: [image | text-content]
 */
export default function parse(element, { document }) {
  // Extract section heading to keep as default content
  const heading = element.querySelector(':scope > h2');

  // Find all article previews
  const articles = element.querySelectorAll('article');
  const cells = [];

  articles.forEach((article) => {
    // Extract image (optional - some articles are text-only)
    const imgEl = article.querySelector('img');

    // Extract date from abbr[title] inside time element
    const dateAbbr = article.querySelector('time abbr[title]');
    const dateText = dateAbbr ? dateAbbr.getAttribute('title') : '';

    // Extract author - may be a link or plain text after the divider
    const metaText = article.querySelector('.c-meta-text');
    const authorLink = metaText ? metaText.querySelector('a.c-hyperlink') : null;

    // Extract title - handles both featured (a > h3) and news (h3 > a) patterns
    const titleLink = article.querySelector('a.f-post-link');
    const titleHeading = article.querySelector('h3');

    // Build text content cell
    const contentCell = [];

    if (dateText) {
      const p = document.createElement('p');
      p.textContent = dateText;
      contentCell.push(p);
    }

    if (authorLink) {
      const p = document.createElement('p');
      p.append(authorLink.cloneNode(true));
      contentCell.push(p);
    } else if (metaText) {
      const divider = metaText.querySelector('.c-meta-divider-space');
      if (divider && divider.nextSibling) {
        const text = divider.nextSibling.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          contentCell.push(p);
        }
      }
    }

    if (titleLink && titleHeading) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleHeading.textContent.trim();
      h3.append(a);
      contentCell.push(h3);
    }

    // Build image cell
    const imageCell = [];
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      imageCell.push(img);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-blog',
    cells,
  });

  // Extract View More link if present (news section)
  const viewMoreLink = element.querySelector('a.f-view-more');

  // Build replacement: heading + block + optional View More
  const frag = document.createDocumentFragment();
  if (heading) frag.append(heading);
  frag.append(block);
  if (viewMoreLink) {
    const p = document.createElement('p');
    p.append(viewMoreLink);
    frag.append(p);
  }

  element.replaceWith(frag);
}
