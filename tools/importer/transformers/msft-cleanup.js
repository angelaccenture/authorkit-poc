/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: msft cleanup.
 * Removes non-authorable content from www.microsoft.com pages.
 * All selectors from captured DOM (migration-work/cleaned.html).
 *
 * The captured HTML is the main content area from AEM GridColumn containers.
 * Custom web components (reimagine-*) are used throughout.
 * Non-authorable elements include: carousel indicators, play/pause controls,
 * link stylesheets, noscript, iframes, and tracking attributes.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove link stylesheet elements injected inside content (from captured DOM: <link rel="stylesheet">)
    WebImporter.DOMUtils.remove(element, ['link[rel="stylesheet"]']);

    // Remove noscript tags (from captured DOM)
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // M365 page: Remove <template> elements (duplicate pricing data inside card-plan-detail)
    WebImporter.DOMUtils.remove(element, ['template']);

    // M365 page: Remove video modal overlays (from captured DOM: div.reimagine-modal)
    WebImporter.DOMUtils.remove(element, ['div.reimagine-modal']);

    // M365 page: Remove empty carousel slides (from captured DOM: div.empty-slide)
    WebImporter.DOMUtils.remove(element, ['div.empty-slide']);
  }

  if (hookName === H.after) {
    // Global header/nav if present (from captured DOM patterns on microsoft.com)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '#headerArea',
      '#footerArea',
      '#uhfHeader',
      '#uhfFooter',
    ]);

    // Cookie/consent banners (from captured DOM patterns on microsoft.com)
    WebImporter.DOMUtils.remove(element, [
      '#msccBannerV2',
      '#uhfCookieAlert',
      '#onetrust-consent-sdk',
      '[id*="cookie-banner"]',
    ]);

    // Skip links and cart iframes (from captured DOM patterns on microsoft.com)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '#uhfSkipToMain',
      '#shell-cart-count',
    ]);

    // Generic non-authorable elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Chat widget / store assistant artifacts
    WebImporter.DOMUtils.remove(element, [
      '.msstore-chatonpage-overlay',
      '[class*="store-assistant"]',
      '[class*="chat-widget"]',
    ]);

    // Tracking pixels (1x1 images from bat.bing.com, etc.)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('bat.bing.com') || src.includes('action/0?')) {
        img.remove();
      }
    });

    // Remove orphaned "Back to Top", "Need help?", "Chat now", "No thanks" text nodes
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (/^(Back to Top|Need help\?|Chat now|No thanks|Chat nowNo thanks|Can we help you\?|Store Assistant is available|Let's chat)$/i.test(text)
        || /^Need help\?\s*Let/i.test(text)) {
        p.remove();
      }
    });
    element.querySelectorAll('h3').forEach((h3) => {
      if (/^Can we help you\?$/i.test(h3.textContent.trim())) {
        h3.remove();
      }
    });

    // Remove "Trace Id is missing" error text
    element.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim() === 'Trace Id is missing') {
        p.remove();
      }
    });

    // Remove tracking/analytics attributes from all elements (from captured DOM: data-bi-* attributes)
    element.querySelectorAll('*').forEach((el) => {
      const attrs = Array.from(el.attributes || []);
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-bi-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
