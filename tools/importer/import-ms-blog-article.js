/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import msBlogArticleCleanupTransformer from './transformers/ms-blog-article-cleanup.js';

// TRANSFORMER REGISTRY
const transformers = [
  msBlogArticleCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'ms-blog-article',
  description: 'Microsoft Blog article page with post content, author info, and related posts',
  urls: [
    'https://blogs.microsoft.com/blog/2026/03/17/announcing-copilot-leadership-update/',
    'https://blogs.microsoft.com/blog/2026/03/16/microsoft-at-nvidia-gtc-new-solutions-for-microsoft-foundry-azure-ai-infrastructure-and-physical-ai/',
    'https://blogs.microsoft.com/blog/2026/03/12/microsoft-announces-experiences-devices-leadership-changes/',
    'https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/',
    'https://blogs.microsoft.com/blog/2026/02/27/microsoft-and-openai-joint-statement-on-continuing-partnership/',
    'https://blogs.microsoft.com/blog/2026/02/24/microsoft-sovereign-cloud-adds-governance-productivity-and-support-for-large-ai-models-securely-running-even-when-completely-disconnected/',
    'https://blogs.microsoft.com/blog/2026/02/20/asha-sharma-named-evp-and-ceo-microsoft-gaming/',
    'https://blogs.microsoft.com/blog/2026/02/18/a-milestone-achievement-in-our-journey-to-carbon-negative/',
    'https://blogs.microsoft.com/blog/2026/02/04/updates-in-two-of-our-core-priorities/',
    'https://blogs.microsoft.com/blog/2026/01/27/how-microsoft-is-empowering-frontier-transformation-with-intelligence-trust/',
    'https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/',
    'https://blogs.microsoft.com/blog/2026/01/13/announcing-open-to-work-how-to-get-ahead-in-the-age-of-ai/',
    'https://blogs.microsoft.com/blog/2026/01/05/microsoft-announces-acquisition-of-osmos-to-accelerate-autonomous-data-engineering-in-fabric/',
    'https://blogs.microsoft.com/blog/2025/11/18/from-idea-to-deployment-the-complete-lifecycle-of-ai-on-display-at-ignite-2025/',
  ],
  blocks: [],
  sections: [
    {
      id: 'section-1',
      name: 'Article Content',
      selector: 'article',
      style: null,
      blocks: [],
      defaultContent: [
        'h1.entry-title',
        '.entry-content > p',
        '.entry-content > h3',
      ],
    },
  ],
};

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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. No blocks to parse - article is all default content

    // 3. Execute afterTransform transformers (extract article content)
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path
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
        blocks: [],
      },
    }];
  },
};
