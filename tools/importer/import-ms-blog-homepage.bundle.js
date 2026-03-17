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

  // tools/importer/import-ms-blog-homepage.js
  var import_ms_blog_homepage_exports = {};
  __export(import_ms_blog_homepage_exports, {
    default: () => import_ms_blog_homepage_default
  });

  // tools/importer/parsers/cards-blog.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector(":scope > h2");
    const articles = element.querySelectorAll("article");
    const cells = [];
    articles.forEach((article) => {
      const imgEl = article.querySelector("img");
      const dateAbbr = article.querySelector("time abbr[title]");
      const dateText = dateAbbr ? dateAbbr.getAttribute("title") : "";
      const metaText = article.querySelector(".c-meta-text");
      const authorLink = metaText ? metaText.querySelector("a.c-hyperlink") : null;
      const titleLink = article.querySelector("a.f-post-link");
      const titleHeading = article.querySelector("h3");
      const contentCell = [];
      if (dateText) {
        const p = document2.createElement("p");
        p.textContent = dateText;
        contentCell.push(p);
      }
      if (authorLink) {
        const p = document2.createElement("p");
        p.append(authorLink.cloneNode(true));
        contentCell.push(p);
      } else if (metaText) {
        const divider = metaText.querySelector(".c-meta-divider-space");
        if (divider && divider.nextSibling) {
          const text = divider.nextSibling.textContent.trim();
          if (text) {
            const p = document2.createElement("p");
            p.textContent = text;
            contentCell.push(p);
          }
        }
      }
      if (titleLink && titleHeading) {
        const h3 = document2.createElement("h3");
        const a = document2.createElement("a");
        a.href = titleLink.href;
        a.textContent = titleHeading.textContent.trim();
        h3.append(a);
        contentCell.push(h3);
      }
      const imageCell = [];
      if (imgEl) {
        const img = document2.createElement("img");
        img.src = imgEl.src;
        img.alt = imgEl.alt || "";
        imageCell.push(img);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-blog",
      cells
    });
    const viewMoreLink = element.querySelector("a.f-view-more");
    const frag = document2.createDocumentFragment();
    if (heading) frag.append(heading);
    frag.append(block);
    if (viewMoreLink) {
      const p = document2.createElement("p");
      p.append(viewMoreLink);
      frag.append(p);
    }
    element.replaceWith(frag);
  }

  // tools/importer/transformers/ms-blog-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ["#uhfCookieAlert"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "#uhfSkipToMain",
        "#headerArea",
        "#footerArea",
        ".social-footer-wrap",
        "section#pivot-target-3"
      ]);
    }
  }

  // tools/importer/transformers/ms-blog-sections.js
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === "afterTransform") {
      const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const doc = element.ownerDocument || document;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-ms-blog-homepage.js
  var parsers = {
    "cards-blog": parse
  };
  var PAGE_TEMPLATE = {
    name: "ms-blog-homepage",
    description: "Microsoft Blog homepage with featured articles, news, and content categories",
    urls: [
      "https://blogs.microsoft.com"
    ],
    blocks: [
      {
        name: "cards-blog",
        instances: [
          "section.featured-posts",
          "section.recent-posts"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Featured Posts",
        selector: "section.featured-posts",
        style: null,
        blocks: ["cards-blog"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "More News",
        selector: "section.recent-posts",
        style: null,
        blocks: ["cards-blog"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_ms_blog_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let path = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!path) path = "/index";
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_ms_blog_homepage_exports);
})();
