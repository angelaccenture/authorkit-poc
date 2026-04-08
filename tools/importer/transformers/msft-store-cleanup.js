/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Microsoft Store configurator page cleanup.
 * Removes non-authorable interactive elements from store/configure pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove link stylesheets injected inside content (from captured DOM)
    WebImporter.DOMUtils.remove(element, ['link[rel="stylesheet"]']);

    // Remove noscript and template tags
    WebImporter.DOMUtils.remove(element, ['noscript', 'template']);

    // Remove survey dialog (from captured DOM: dialog with Microsoft Survey)
    WebImporter.DOMUtils.remove(element, ['dialog']);

    // Remove sticky bar (interactive nav element, from captured DOM: .configuratorV35-sticky-bar)
    WebImporter.DOMUtils.remove(element, ['.configuratorV35-sticky-bar']);

    // Remove step indicator (interactive wizard nav, from captured DOM: .step-indicator)
    WebImporter.DOMUtils.remove(element, ['.step-indicator']);

    // Remove carousel controls (from captured DOM: .carousel-controls, .carousel-control-next, .carousel-control-prev)
    WebImporter.DOMUtils.remove(element, ['.carousel-controls', '.carousel-control-next', '.carousel-control-prev']);

    // Remove modals (from captured DOM: .modal)
    WebImporter.DOMUtils.remove(element, ['.modal']);

    // Remove popover tooltips (from captured DOM: .popover)
    WebImporter.DOMUtils.remove(element, ['.popover']);

    // Remove hidden carousel images (from captured DOM: .configuratorV35-image-hero-container.d-none)
    WebImporter.DOMUtils.remove(element, ['.configuratorV35-image-hero-container.d-none']);

    // Remove hidden product card panels (from captured DOM: .productcards-panel-container-v35.d-none)
    WebImporter.DOMUtils.remove(element, ['.productcards-panel-container-v35.d-none']);
  }

  if (hookName === H.after) {
    // Remove header/footer/nav (global chrome)
    WebImporter.DOMUtils.remove(element, ['header', 'footer', 'nav']);

    // Remove cookie/consent banners
    WebImporter.DOMUtils.remove(element, [
      '#msccBannerV2',
      '#onetrust-consent-sdk',
      '[id*="cookie-banner"]',
    ]);

    // Remove chat widget / store assistant (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '[class*="store-assistant"]',
      '[class*="chat-widget"]',
      '.msstore-chatonpage-overlay',
    ]);

    // Remove "Back to Top" link (from captured DOM: a[href="#page-top"])
    WebImporter.DOMUtils.remove(element, ['a[href="#page-top"]']);

    // Remove summary/checkout sidebar (interactive cart, from captured DOM)
    const summaryRegion = element.querySelector('[aria-label="Summary"]');
    if (summaryRegion) summaryRegion.remove();

    // Remove generic non-authorable elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      const attrs = Array.from(el.attributes || []);
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-bi-') || attr.name.startsWith('data-m')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove orphaned chat/help text nodes
    element.querySelectorAll('p, h3').forEach((el) => {
      const text = el.textContent.trim();
      if (/^(Back to Top|Need help\?|Chat now|No thanks|Can we help you\?|Store Assistant|Let's chat)$/i.test(text)) {
        el.remove();
      }
    });
  }
}
