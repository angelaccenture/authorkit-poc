/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsBlogParser from './parsers/cards-blog.js';

// TRANSFORMER IMPORTS
import msBlogCleanupTransformer from './transformers/ms-blog-cleanup.js';
import msBlogSectionsTransformer from './transformers/ms-blog-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-blog': cardsBlogParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'ms-blog-homepage',
  description: 'Microsoft Blog homepage with featured articles, news, and content categories',
  urls: [
    'https://blogs.microsoft.com',
  ],
  blocks: [
    {
      name: 'cards-blog',
      instances: [
        'section.featured-posts',
        'section.recent-posts',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Featured Posts',
      selector: 'section.featured-posts',
      style: null,
      blocks: ['cards-blog'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'More News',
      selector: 'section.recent-posts',
      style: null,
      blocks: ['cards-blog'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  msBlogCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [msBlogSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (avoid FileUtils.sanitizePath which needs process.cwd)
    let path = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    if (!path) path = '/index';

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
