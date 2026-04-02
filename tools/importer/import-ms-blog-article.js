/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsBlogParser from './parsers/cards-blog.js';

// TRANSFORMER IMPORTS (ms-blog transformers for blogs.microsoft.com)
import msBlogCleanupTransformer from './transformers/ms-blog-cleanup.js';
import msBlogSectionsTransformer from './transformers/ms-blog-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-blog': cardsBlogParser,
};

// PAGE TEMPLATE CONFIGURATION (from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'ms-blog-article',
  description: 'Microsoft blog article page with author info, article content, and related posts',
  urls: [
    'https://blogs.microsoft.com/blog/2026/03/31/open-to-work-how-to-get-ahead-in-the-age-of-ai/',
  ],
  blocks: [
    {
      name: 'cards-blog',
      instances: ['aside#secondary article.m-preview'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Article Header', selector: 'header.entry-header.m-blog-content', style: null, blocks: [], defaultContent: ['h1.entry-title', 'p.c-meta-text'] },
    { id: 'section-2', name: 'Hero Image', selector: 'img.wp-post-image', style: null, blocks: [], defaultContent: ['img.wp-post-image'] },
    { id: 'section-3', name: 'Article Body', selector: 'div.entry-content.m-blog-content', style: null, blocks: [], defaultContent: ['div.entry-content p', 'p.tag-list'] },
    { id: 'section-4', name: 'Related Blogs', selector: 'aside#secondary', style: null, blocks: ['cards-blog'], defaultContent: ['h3.ms-related-blogs'] },
    { id: 'section-5', name: 'Social Footer', selector: 'div.social-footer-wrap', style: null, blocks: [], defaultContent: ['div.m-social'] },
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
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
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
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
