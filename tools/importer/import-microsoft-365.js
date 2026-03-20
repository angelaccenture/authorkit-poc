/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for microsoft-365 template
import heroM365Parser from './parsers/hero-m365.js';
import columnsParser from './parsers/columns.js';
import teaserParser from './parsers/teaser.js';
import cardParser from './parsers/card.js';
import cardAppParser from './parsers/card-app.js';
import pricingCardsParser from './parsers/pricing-cards.js';
import advancedAccordionParser from './parsers/advanced-accordion.js';
import socialFollowParser from './parsers/social-follow.js';

// TRANSFORMER IMPORTS - Microsoft site transformers
import msftCleanupTransformer from './transformers/msft-cleanup.js';
import msftSectionsTransformer from './transformers/msft-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-m365': heroM365Parser,
  'columns': columnsParser,
  'teaser': teaserParser,
  'card': cardParser,
  'card-app': cardAppParser,
  'pricing-cards': pricingCardsParser,
  'advanced-accordion': advancedAccordionParser,
  'social-follow': socialFollowParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  msftCleanupTransformer,
  msftSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'microsoft-365',
  description: 'Microsoft 365 product landing page showcasing subscription plans, features, and pricing',
  urls: [
    'https://www.microsoft.com/en-us/microsoft-365'
  ],
  blocks: [
    {
      name: 'hero-m365',
      instances: ['div.section-master--bg-image.section-master--blade-hero-slim']
    },
    {
      name: 'columns',
      instances: ['div.ocr-accordion.accordion--vertical-product']
    },
    {
      name: 'teaser',
      instances: ['div.card-horizontal-container']
    },
    {
      name: 'card',
      instances: [
        'div.cta-stacked--vertical-cards .card',
        'div.section-master:has(#Get-started) .three-up-cards .card'
      ]
    },
    {
      name: 'card-app',
      instances: ['div.card-grid__cards .card']
    },
    {
      name: 'pricing-cards',
      instances: ['div.carousel.carousel--card-grid']
    },
    {
      name: 'advanced-accordion',
      instances: ['div.ocr-faq']
    },
    {
      name: 'social-follow',
      instances: ['div.socialfollow']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Announcement Bar',
      selector: 'div.ocr-announcement-banner',
      style: 'announcement-bar',
      blocks: [],
      defaultContent: [
        'section.announcement-banner .announcement-banner__content',
        'section.announcement-banner .announcement-banner__action a'
      ]
    },
    {
      id: 'section-2',
      name: 'Hero',
      selector: 'div.section-master--bg-image.section-master--blade-hero-slim',
      style: null,
      blocks: ['hero-m365'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Copilot Features',
      selector: 'div.section-master:has(#How-it-works)',
      style: null,
      blocks: ['columns'],
      defaultContent: [
        '#How-it-works .block-heading__eyebrow',
        '#How-it-works h2',
        'a#action-ocd6d02'
      ]
    },
    {
      id: 'section-4',
      name: 'News / Discover',
      selector: 'div.section-master:has(#news)',
      style: null,
      blocks: ['teaser', 'card'],
      defaultContent: ['#news h2']
    },
    {
      id: 'section-5',
      name: "What's Included",
      selector: 'div.section-master:has(#Whats-included)',
      style: 'light-grey',
      blocks: ['card-app'],
      defaultContent: [
        '#Whats-included .block-heading__eyebrow',
        '#Whats-included h2',
        'a#action-ocd6d0'
      ]
    },
    {
      id: 'section-6',
      name: 'Plans / Pricing',
      selector: 'div.product-plan-cards',
      style: null,
      blocks: ['pricing-cards'],
      defaultContent: [
        '#Plans .block-heading__eyebrow',
        '#Plans h2'
      ]
    },
    {
      id: 'section-7',
      name: 'Get Started',
      selector: 'div.section-master:has(#Get-started)',
      style: null,
      blocks: ['card'],
      defaultContent: [
        '#Get-started .block-heading__eyebrow',
        '#Get-started h2'
      ]
    },
    {
      id: 'section-8',
      name: 'FAQ',
      selector: 'div.section-master:has(#FAQ)',
      style: null,
      blocks: ['advanced-accordion'],
      defaultContent: ['#FAQ h2']
    },
    {
      id: 'section-9',
      name: 'Legal Disclaimers',
      selector: 'div.section-master:has(.footnote)',
      style: null,
      blocks: [],
      defaultContent: ['div.footnote']
    },
    {
      id: 'section-10',
      name: 'Follow Microsoft 365',
      selector: 'div.section-master.bg--base-neutral:has(.socialfollow)',
      style: null,
      blocks: ['social-follow'],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
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
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
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

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
