var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-ms-blog-article.js
  var import_ms_blog_article_exports = {};
  __export(import_ms_blog_article_exports, {
    default: () => import_ms_blog_article_default
  });

  // tools/importer/parsers/cards-blog.js
  function parse(element, { document }) {
    const section = element.closest("section.featured-posts, section.recent-posts, aside#secondary");
    if (!section) {
      element.remove();
      return;
    }
    const articles = Array.from(section.querySelectorAll("article.m-preview"));
    if (articles.indexOf(element) !== 0) {
      element.remove();
      return;
    }
    const cells = [];
    articles.forEach((article) => {
      const img = article.querySelector("a.m-preview-image img, img.c-image.wp-post-image");
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const textCell = [];
      const metaText = article.querySelector("p.c-meta-text");
      if (metaText) {
        textCell.push(metaText);
      }
      const titleH3 = article.querySelector("h3");
      if (titleH3) {
        textCell.push(titleH3);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-blog", cells });
    element.replaceWith(block);
    articles.slice(1).forEach((a) => a.remove());
  }

  // tools/importer/transformers/ms-blog-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#msccBannerV2",
        "#uhfCookieAlert"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["#headerArea"]);
      WebImporter.DOMUtils.remove(element, ["#footerArea"]);
      WebImporter.DOMUtils.remove(element, [".skip-link", "#uhfSkipToMain"]);
      WebImporter.DOMUtils.remove(element, ["#shell-cart-count"]);
      WebImporter.DOMUtils.remove(element, ["#pivot-target-3"]);
      WebImporter.DOMUtils.remove(element, [".social-footer-wrap"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
    }
  }

  // tools/importer/transformers/ms-blog-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(
            element.ownerDocument,
            { name: "Section Metadata", cells: { style: section.style } }
          );
          sectionEl.after(sectionMetadata);
        }
        const isFirst = sections.indexOf(section) === 0;
        if (!isFirst) {
          const hr = element.ownerDocument.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-ms-blog-article.js
  var parsers = {
    "cards-blog": parse
  };
  var PAGE_TEMPLATE = {
    name: "ms-blog-article",
    description: "Microsoft blog article page with author info, article content, and related posts",
    urls: [
      "https://blogs.microsoft.com/blog/2026/03/31/open-to-work-how-to-get-ahead-in-the-age-of-ai/"
    ],
    blocks: [
      {
        name: "cards-blog",
        instances: ["aside#secondary article.m-preview"]
      }
    ],
    sections: [
      { id: "section-1", name: "Article Header", selector: "header.entry-header.m-blog-content", style: null, blocks: [], defaultContent: ["h1.entry-title", "p.c-meta-text"] },
      { id: "section-2", name: "Hero Image", selector: "img.wp-post-image", style: null, blocks: [], defaultContent: ["img.wp-post-image"] },
      { id: "section-3", name: "Article Body", selector: "div.entry-content.m-blog-content", style: null, blocks: [], defaultContent: ["div.entry-content p", "p.tag-list"] },
      { id: "section-4", name: "Related Blogs", selector: "aside#secondary", style: null, blocks: ["cards-blog"], defaultContent: ["h3.ms-related-blogs"] },
      { id: "section-5", name: "Social Footer", selector: "div.social-footer-wrap", style: null, blocks: [], defaultContent: ["div.m-social"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_ms_blog_article_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_ms_blog_article_exports);
})();
