/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: msft-developer cleanup.
 * Removes non-authorable content from developer.microsoft.com pages.
 * All selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie/consent banners
    WebImporter.DOMUtils.remove(element, [
      '#msccBannerV2',
      '#uhfCookieAlert',
      '[class*="cookie-banner"]',
    ]);

    // Remove inline SVG sprite sheets and hidden elements
    WebImporter.DOMUtils.remove(element, [
      'svg[style*="display: none"]',
      '[aria-hidden="true"]:not(img)',
    ]);
  }

  if (hookName === H.after) {
    // UHF header and footer (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#headerArea',
      '#headerRegion',
      'header.c-uhfh',
      'footer#uhf-footer',
      '#footerArea',
      '#footerRegion',
    ]);

    // Skip links
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '#uhfSkipToMain',
      'a[href="javascript:void(0)"]',
    ]);

    // Carousel navigation controls (handled by EDS carousel block)
    WebImporter.DOMUtils.remove(element, [
      '.carousel__controls',
      '.carousel__announcement-text',
      'a.sr-only-focusable',
    ]);

    // Tab overflow arrows (handled by EDS tabs block)
    WebImporter.DOMUtils.remove(element, [
      '.tab-arrows',
      '.pill-bar__arrow-prev-bg',
      '.pill-bar__arrow-next-bg',
    ]);

    // Screen reader only text that's not needed in content
    WebImporter.DOMUtils.remove(element, [
      '.sr-only:not(.carousel__announcement-text)',
    ]);

    // Site banners container wrapper (keep children)
    const siteBanners = element.querySelector('.site-banners');
    if (siteBanners) {
      while (siteBanners.firstChild) {
        siteBanners.parentNode.insertBefore(siteBanners.firstChild, siteBanners);
      }
      siteBanners.remove();
    }

    // Generic non-authorable elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript', 'script']);
  }
}
