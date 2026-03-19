/* eslint-disable */
/* global WebImporter */

/**
 * Import script for template: msft-homepage
 * Microsoft corporate homepage with hero banners, product highlights, and promotional content.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Orchestrates parsers and transformers to migrate content from the Microsoft
 * corporate homepage into AEM Edge Delivery Services format.
 */

// PARSER IMPORTS
import advancedCarouselParser from './parsers/advanced-carousel.js';
import heroCarouselSlideParser from './parsers/hero-carousel-slide.js';
import aiChatParser from './parsers/ai-chat.js';
import quickLinksParser from './parsers/quick-links.js';
import cardsParser from './parsers/cards.js';
import heroParser from './parsers/hero.js';
import bannerCarouselSlideParser from './parsers/banner-carousel-slide.js';
import socialFollowParser from './parsers/social-follow.js';

// TRANSFORMER IMPORTS
import msftCleanupTransformer from './transformers/msft-cleanup.js';
import msftSectionsTransformer from './transformers/msft-sections.js';

// PARSER REGISTRY - Map block names to parser functions
const parsers = {
  'advanced-carousel': advancedCarouselParser,
  'hero-carousel-slide': heroCarouselSlideParser,
  'ai-chat': aiChatParser,
  'quick-links': quickLinksParser,
  'cards': cardsParser,
  'hero': heroParser,
  'banner-carousel-slide': bannerCarouselSlideParser,
  'social-follow': socialFollowParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'msft-homepage',
  urls: [
    'https://www.microsoft.com/en-us',
  ],
  description: 'Microsoft corporate homepage with hero banners, product highlights, and promotional content',
  blocks: [
    {
      name: 'advanced-carousel',
      instances: [
        'div.hero-featured-slider reimagine-carousel',
        'div.ui-shell reimagine-carousel',
      ],
    },
    {
      name: 'hero-carousel-slide',
      instances: [
        'div.hero-featured-slider reimagine-carousel-item reimagine-hero-featured-slider-item',
      ],
    },
    {
      name: 'ai-chat',
      instances: [
        'div.msstore-chatonpage.contained',
      ],
    },
    {
      name: 'quick-links',
      instances: [
        'div.quicklinks reimagine-secondary-nav[configuration=\'quicklinks\']',
      ],
    },
    {
      name: 'cards',
      instances: [
        'div.featured[data-component-id=\'71510296gldd3806gafb03daf4f77h07\'] reimagine-card-feature',
        'div.featured[data-component-id=\'29710086fcdd3366caca03daf4f66b57\'] reimagine-card-feature',
        'div.featured[data-component-id=\'29710086fcdd3366caca03daf4f66b57\'] reimagine-card-feature',
      ],
    },
    {
      name: 'hero',
      instances: [
        'reimagine-banner-featured[background=\'base-neutral\'] reimagine-card-banner',
      ],
    },
    {
      name: 'banner-carousel-slide',
      instances: [
        'div.ui-shell reimagine-carousel-item reimagine-card-banner',
      ],
    },
    {
      name: 'social-follow',
      instances: [
        'div.logo-footer reimagine-logo-footer',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Announcement Bar',
      selector: 'div[ocr-component-name=\'cascade-announcement-wc\']',
      style: 'announcement-bar',
      blocks: [],
      defaultContent: [
        'reimagine-announcement p[slot=\'announcement__label\']',
        'reimagine-announcement reimagine-link[slot=\'announcement__link\']',
      ],
    },
    {
      id: 'section-2',
      name: 'Hero Carousel',
      selector: 'div.hero-featured-slider',
      style: null,
      blocks: [
        'advanced-carousel',
        'hero-carousel-slide',
      ],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'AI Assistant / Chat',
      selector: 'div.banner-featured.tabs.panelcontainer:has(div.msstore-chatonpage)',
      style: null,
      blocks: [
        'ai-chat',
      ],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Product Category Navigation',
      selector: 'div.quicklinks',
      style: null,
      blocks: [
        'quick-links',
      ],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Content Promotion Cards',
      selector: 'div.featured[data-component-id=\'71510296gldd3806gafb03daf4f77h07\']',
      style: null,
      blocks: [
        'cards',
      ],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Full-Width Promotional Banner',
      selector: 'div.banner-featured.tabs.panelcontainer:has(reimagine-banner-featured[background=\'base-neutral\'])',
      style: 'dark',
      blocks: [
        'hero',
      ],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'For Business Section',
      selector: 'div.featured[data-component-id=\'29710086fcdd3366caca03daf4f66b57\']:has(reimagine-featured[configuration=\'4-col-even-2\'])',
      style: 'light-grey',
      blocks: [
        'cards',
      ],
      defaultContent: [
        'reimagine-featured[background=\'base-fade\'] reimagine-heading-block[data-en-title=\'For business\'] h2',
      ],
    },
    {
      id: 'section-8',
      name: 'Get to Know AI and Copilot Section',
      selector: 'div.featured[data-component-id=\'29710086fcdd3366caca03daf4f66b57\']:has(reimagine-featured[configuration=\'3-col-even\'])',
      style: 'light-grey',
      blocks: [
        'cards',
      ],
      defaultContent: [
        'reimagine-featured[configuration=\'3-col-even\'] reimagine-heading-block h2',
      ],
    },
    {
      id: 'section-9',
      name: 'Bottom Carousel',
      selector: 'div.ui-shell[data-component-id=\'78886cafd6af66b1105378432d26acef\']',
      style: null,
      blocks: [
        'advanced-carousel',
        'banner-carousel-slide',
      ],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Follow Microsoft',
      selector: 'div.logo-footer[data-component-id=\'6fd6abbfb7d19a0d568b967c721295ee\']',
      style: null,
      blocks: [
        'social-follow',
      ],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Cleanup runs first, sections transformer runs after (adds <hr> and Section Metadata)
const transformers = [
  msftCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [msftSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform (typically document.body)
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of { name, selector, element, section } objects
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements = [];
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }

      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }

      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function using the one-input / multiple-outputs pattern.
   * Orchestrates transformers and parsers to convert the Microsoft homepage
   * into AEM Edge Delivery Services format.
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup: remove stylesheets, noscript, etc.)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template selectors
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/en-us',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
