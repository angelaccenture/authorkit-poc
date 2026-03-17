/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Microsoft Blog article cleanup.
 * Removes non-authorable content and extracts article body.
 * Keeps h1, date/author, social share links, hero image, and body content.
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

      const fragment = document.createDocumentFragment();

      // 1. Keep the h1 title
      const h1 = entryHeader ? entryHeader.querySelector('h1') : null;
      if (h1) {
        fragment.appendChild(h1.cloneNode(true));
      }

      // 2. Keep date/author line
      const metaText = entryHeader ? entryHeader.querySelector('p.c-meta-text, p:has(time)') : null;
      if (metaText) {
        const datePara = document.createElement('p');
        datePara.className = 'article-date';
        const time = metaText.querySelector('time');
        const authorLink = metaText.querySelector('a');
        const parts = [];
        if (time) parts.push(time.textContent.trim());
        if (authorLink) parts.push(authorLink.textContent.trim());
        datePara.textContent = parts.join(' | ');
        fragment.appendChild(datePara);
      }

      // 3. Keep social share links
      const shareList = entryHeader ? entryHeader.querySelector('ul') : null;
      if (shareList) {
        const ul = document.createElement('ul');
        ul.className = 'article-share';
        const links = shareList.querySelectorAll('a');
        const iconMap = { facebook: 'Facebook', twitter: 'X', linkedin: 'LinkedIn', threads: 'Threads' };
        links.forEach((link) => {
          const href = link.getAttribute('href') || '';
          let label = '';
          for (const [key, val] of Object.entries(iconMap)) {
            if (href.includes(key)) { label = val; break; }
          }
          if (label) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = href;
            a.textContent = label;
            a.setAttribute('target', '_blank');
            li.appendChild(a);
            ul.appendChild(li);
          }
        });
        if (ul.children.length > 0) {
          fragment.appendChild(ul);
        }
      }

      // 4. Keep hero image
      const heroImg = article.querySelector(':scope > img, .entry-content-hero img');
      if (heroImg) {
        const p = document.createElement('p');
        p.className = 'article-hero';
        p.appendChild(heroImg.cloneNode(true));
        fragment.appendChild(p);
      }

      // 5. Keep the article body content
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
