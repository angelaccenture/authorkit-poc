/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Microsoft Blog cleanup.
 * Removes non-authorable content: UHF header, UHF footer, social footer,
 * skip links, cookie banner, and hidden Press Tools section.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // From captured DOM: <div id="uhfCookieAlert"> containing <div id="msccBannerV2">
    WebImporter.DOMUtils.remove(element, ['#uhfCookieAlert']);
  }

  if (hookName === H.after) {
    // From captured DOM:
    // - <a class="skip-link screen-reader-text"> (skip to content link)
    // - <a id="uhfSkipToMain" class="m-skip-to-main"> (UHF skip to main)
    // - <div id="headerArea" class="uhf"> (entire UHF header with nav)
    // - <div id="footerArea"> (UHF footer)
    // - <div class="social-footer-wrap"> (social footer with RSS link)
    // - <section id="pivot-target-3"> (hidden Press Tools section)
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '#uhfSkipToMain',
      '#headerArea',
      '#footerArea',
      '.social-footer-wrap',
      'section#pivot-target-3',
    ]);
  }
}
