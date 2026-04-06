/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardParser from './parsers/card.js';
import quickLinksParser from './parsers/quick-links.js';
import videoQuoteParser from './parsers/video-quote.js';
import cardsBlogParser from './parsers/cards-blog.js';
import socialFollowParser from './parsers/social-follow.js';

// TRANSFORMER IMPORTS
import msftDevCleanupTransformer from './transformers/msft-developer-cleanup.js';
import msftDevSectionsTransformer from './transformers/msft-developer-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'card': cardParser,
  'quick-links': quickLinksParser,
  'video-quote': videoQuoteParser,
  'cards-blog': cardsBlogParser,
  'social-follow': socialFollowParser,
};

// PAGE TEMPLATE
const PAGE_TEMPLATE = {
  name: 'msft-developer',
  description: 'Microsoft Developer homepage',
  urls: ['https://developer.microsoft.com/en-us/'],
  blocks: [
    { name: 'hero', instances: ['div.section-master--blade-hero-card-carousel'] },
    { name: 'card', instances: ['div.card-content', 'div.card-promo'] },
    { name: 'quick-links', instances: ['section#languages div.layout'] },
    { name: 'video-quote', instances: ['section#developer-story, [class*=developer-story]'] },
    { name: 'cards-blog', instances: ['section#blogs div.card-content'] },
    { name: 'social-follow', instances: ['div.social-links, [class*=social-links]'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Banner', selector: 'div.section-master--blade-hero-card-carousel', style: 'dark', blocks: ['hero'], defaultContent: [] },
    { id: 'section-2', name: 'Featured Products', selector: 'div.section-master--blade-card-carousel:has(.pill-bar)', style: null, blocks: ['card'], defaultContent: ['h3', 'h2'] },
    { id: 'section-3', name: 'Events Banner Carousel', selector: '#banner-carousel', style: null, blocks: ['card'], defaultContent: [] },
    { id: 'section-4', name: 'News & Updates', selector: ['section:has(#discover-whats-new-carousel)', '[class*=whats-new]'], style: null, blocks: ['card'], defaultContent: ['h3', 'h2'] },
    { id: 'section-5', name: 'Languages', selector: 'section#languages', style: null, blocks: ['quick-links'], defaultContent: ['h3', 'h2', 'p'] },
    { id: 'section-6', name: 'Communities', selector: 'section#communities', style: null, blocks: ['card'], defaultContent: ['h3', 'h2'] },
    { id: 'section-7', name: 'Resource Hubs', selector: 'section#hubs', style: null, blocks: ['card'], defaultContent: ['h3', 'h2'] },
    { id: 'section-8', name: 'Developer Story', selector: ['section#developer-story', '[class*=developer-story]'], style: 'light-grey', blocks: ['video-quote'], defaultContent: [] },
    { id: 'section-9', name: 'Blog', selector: 'section#blogs', style: null, blocks: ['cards-blog'], defaultContent: ['h2', 'a'] },
    { id: 'section-10', name: 'Events', selector: 'section#events', style: null, blocks: ['cards-blog'], defaultContent: ['h3', 'h2', 'a'] },
    { id: 'section-11', name: 'Newsletter', selector: 'section#source-newsletter', style: 'dark', blocks: [], defaultContent: ['h2', 'p', 'a'] },
    { id: 'section-12', name: 'Learn With Us', selector: 'section#learn', style: null, blocks: ['card'], defaultContent: ['h3', 'h2'] },
    { id: 'section-13', name: 'Social Follow', selector: ['div.social-links', '[class*=social-links]'], style: null, blocks: ['social-follow'], defaultContent: [] },
  ],
};

const transformers = [
  msftDevCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [msftDevSectionsTransformer] : []),
];

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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
