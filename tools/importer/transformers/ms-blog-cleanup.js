/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ms-blog cleanup.
 * Removes non-authorable content from blogs.microsoft.com pages.
 * All selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie banners and consent dialogs (from captured DOM: #msccBannerV2, #uhfCookieAlert)
    WebImporter.DOMUtils.remove(element, [
      '#msccBannerV2',
      '#uhfCookieAlert',
    ]);
  }

  if (hookName === H.after) {
    // UHF header (from captured DOM: <div id="headerArea" class="uhf">)
    WebImporter.DOMUtils.remove(element, ['#headerArea']);

    // UHF footer (from captured DOM: <div id="footerArea" class="uhf">)
    WebImporter.DOMUtils.remove(element, ['#footerArea']);

    // Skip links (from captured DOM: <a class="skip-link">, <a id="uhfSkipToMain">)
    WebImporter.DOMUtils.remove(element, ['.skip-link', '#uhfSkipToMain']);

    // Shopping cart iframe (from captured DOM: <iframe id="shell-cart-count">)
    WebImporter.DOMUtils.remove(element, ['#shell-cart-count']);

    // Hidden Press Tools pivot panel (from captured DOM: <section id="pivot-target-3">)
    WebImporter.DOMUtils.remove(element, ['#pivot-target-3']);

    // Social footer wrap (from captured DOM: <div class="social-footer-wrap">)
    WebImporter.DOMUtils.remove(element, ['.social-footer-wrap']);

    // Generic non-authorable elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);
  }
}
