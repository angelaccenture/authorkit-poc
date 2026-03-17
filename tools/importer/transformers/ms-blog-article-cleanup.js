/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Microsoft Blog article cleanup.
 * Removes non-authorable content and extracts article body.
 * Keeps only the article header (h1, date, author) and body content.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === H.before) {
    // Remove cookie banner
    WebImporter.DOMUtils.remove(element, ['#uhfCookieAlert']);
  }

  if (hookName === H.after) {
    // Remove site chrome and non-content elements
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '#uhfSkipToMain',
      '#headerArea',
      '#footerArea',
      '.social-footer-wrap',
      '.c-social',
      'aside#secondary',
      '[data-grid="col-4"]:has(aside)',
    ]);

    // Unwrap the article from its grid container
    const article = element.querySelector('article');
    if (article) {
      const entryContent = article.querySelector('.entry-content');
      const entryHeader = article.querySelector('.entry-header');

      // Build clean structure: just the h1 and article body
      const fragment = document.createDocumentFragment();

      // Keep the h1 title
      const h1 = entryHeader ? entryHeader.querySelector('h1') : null;
      if (h1) {
        fragment.appendChild(h1.cloneNode(true));
      }

      // Keep the article body content
      if (entryContent) {
        Array.from(entryContent.children).forEach((child) => {
          fragment.appendChild(child.cloneNode(true));
        });
      }

      // Clear the main element and add clean content
      const main = element.querySelector('main') || element;
      main.textContent = '';
      main.appendChild(fragment);
    }
  }
}
