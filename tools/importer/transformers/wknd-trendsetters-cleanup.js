/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Removes non-authorable content (navbar, footer, skip-link).
 * Selectors from captured DOM (cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    // From captured DOM: <a class="skip-link">, <div class="navbar">, <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
