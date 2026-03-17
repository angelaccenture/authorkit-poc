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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector("h1.h1-heading, h1, h2");
    const subheading = element.querySelector("p.subheading, p");
    const ctas = Array.from(element.querySelectorAll(".button-group a.button"));
    const images = Array.from(element.querySelectorAll(".grid-layout .cover-image, .grid-layout img"));
    const imageCell = [];
    images.forEach((img) => imageCell.push(img));
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctas);
    const cells = [];
    if (imageCell.length > 0) cells.push(imageCell);
    if (contentCell.length > 0) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length < 2) {
      const block2 = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells: [[element]] });
      element.replaceWith(block2);
      return;
    }
    const imageCol = columns[0];
    const image = imageCol.querySelector("img.cover-image, img");
    const textCol = columns[1];
    const breadcrumbs = textCol.querySelector(".breadcrumbs");
    const heading = textCol.querySelector("h2.h2-heading, h2");
    const authorName = textCol.querySelector(".utility-text-black, .paragraph-sm:not(.utility-text-secondary)");
    const dateInfo = textCol.querySelectorAll(".utility-margin-top-0-5rem .paragraph-sm, .flex-gap-xxs .paragraph-sm");
    const col1 = [];
    if (image) col1.push(image);
    const col2 = [];
    if (breadcrumbs) {
      const breadcrumbLinks = breadcrumbs.querySelectorAll("a");
      const breadcrumbP = document2.createElement("p");
      breadcrumbLinks.forEach((link, idx) => {
        if (idx > 0) breadcrumbP.append(document2.createTextNode(" > "));
        breadcrumbP.append(link);
      });
      col2.push(breadcrumbP);
    }
    if (heading) col2.push(heading);
    const metaP = document2.createElement("p");
    const bySpan = textCol.querySelector(".utility-text-secondary");
    if (bySpan && authorName) {
      metaP.append(document2.createTextNode("By "));
      const strong = document2.createElement("strong");
      strong.textContent = authorName.textContent.trim();
      metaP.append(strong);
    }
    const dateContainer = textCol.querySelector(".utility-margin-top-0-5rem");
    if (dateContainer) {
      const dateSpans = dateContainer.querySelectorAll(".paragraph-sm");
      if (dateSpans.length > 0) {
        const dateP = document2.createElement("p");
        dateSpans.forEach((span) => {
          dateP.append(document2.createTextNode(span.textContent.trim() + " "));
        });
        col2.push(dateP);
      }
    }
    if (metaP.childNodes.length > 0) col2.push(metaP);
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const imageItems = Array.from(element.querySelectorAll(".utility-aspect-1x1, :scope > div"));
    const cells = [];
    imageItems.forEach((item) => {
      const img = item.querySelector("img.cover-image, img");
      if (img) {
        cells.push([img, ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/advanced-tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const tabPanes = Array.from(element.querySelectorAll(".tab-pane"));
    const cells = [];
    tabPanes.forEach((pane) => {
      const img = pane.querySelector("img.cover-image, img");
      const contentCell = [];
      const nameStrong = pane.querySelector(".paragraph-xl strong, strong");
      if (nameStrong) {
        const nameP = document2.createElement("p");
        const strong = document2.createElement("strong");
        strong.textContent = nameStrong.textContent.trim();
        nameP.append(strong);
        contentCell.push(nameP);
      }
      const nameContainer = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameContainer && nameContainer.parentElement) {
        const roleEl = nameContainer.parentElement.querySelector(":scope > div:not(.paragraph-xl)");
        if (roleEl && roleEl.textContent.trim()) {
          const roleP = document2.createElement("p");
          roleP.textContent = roleEl.textContent.trim();
          contentCell.push(roleP);
        }
      }
      const quoteEl = pane.querySelector("p.paragraph-xl");
      if (quoteEl) {
        const quoteP = document2.createElement("p");
        quoteP.textContent = quoteEl.textContent.trim();
        contentCell.push(quoteP);
      }
      cells.push([img || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "advanced-tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const articles = Array.from(element.querySelectorAll("a.article-card, a.card-link"));
    const cells = [];
    articles.forEach((article) => {
      const img = article.querySelector(".article-card-image img, img.cover-image, img");
      const body = article.querySelector(".article-card-body");
      const textCell = [];
      if (body) {
        const tag = body.querySelector(".tag, span.tag");
        if (tag) {
          const tagP = document2.createElement("p");
          tagP.textContent = tag.textContent.trim();
          textCell.push(tagP);
        }
        const dateEl = body.querySelector(".article-card-meta .paragraph-sm.utility-text-secondary, .paragraph-sm.utility-text-secondary");
        if (dateEl) {
          const dateP = document2.createElement("p");
          dateP.textContent = dateEl.textContent.trim();
          textCell.push(dateP);
        }
        const title = body.querySelector('h3, h4, [class*="heading"]');
        if (title) textCell.push(title);
      }
      const link = document2.createElement("a");
      link.href = article.href || article.getAttribute("href") || "#";
      link.textContent = "Read more";
      const linkP = document2.createElement("p");
      linkP.append(link);
      textCell.push(linkP);
      cells.push([img || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const faqItems = Array.from(element.querySelectorAll("details.faq-item, details"));
    const cells = [];
    faqItems.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      const questionSpan = summary ? summary.querySelector("span") : null;
      const questionText = questionSpan ? questionSpan.textContent.trim() : summary ? summary.textContent.trim() : "";
      const answerDiv = item.querySelector(".faq-answer, div:not(summary)");
      const answerParagraphs = answerDiv ? Array.from(answerDiv.querySelectorAll("p")) : [];
      const answerCell = [];
      if (answerParagraphs.length > 0) {
        answerParagraphs.forEach((p) => answerCell.push(p));
      } else if (answerDiv) {
        const p = document2.createElement("p");
        p.textContent = answerDiv.textContent.trim();
        answerCell.push(p);
      }
      cells.push([questionText, answerCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector("img.cover-image");
    const heading = element.querySelector(".card-body h2, .card-body h1, h2.h1-heading");
    const subheading = element.querySelector(".card-body p.subheading, .card-body p");
    const cta = element.querySelector(".card-body a.button, .card-body .button-group a");
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (cta) contentCell.push(cta);
    if (contentCell.length > 0) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-landing": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "advanced-tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template for WKND Trendsetters site",
    urls: [
      "https://wknd-trendsetters.site"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: ["header.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["main > section:first-of-type .grid-layout.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: [".section.secondary-section .grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "advanced-tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".section.secondary-section .grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ["header.secondary-section", "main > :first-child"],
        style: "light",
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section:first-of-type",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Image Gallery",
        selector: "main > section:nth-of-type(2)",
        style: "light",
        blocks: ["cards-gallery"],
        defaultContent: [".utility-text-align-center h2", ".utility-text-align-center p"]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "main > section:nth-of-type(3)",
        style: null,
        blocks: ["advanced-tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: "main > section:nth-of-type(4)",
        style: "light",
        blocks: ["cards-article"],
        defaultContent: [".utility-text-align-center h2", ".utility-text-align-center p"]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["h2.h2-heading", "p.subheading"]
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "section.inverse-section",
        style: null,
        blocks: ["hero-banner"],
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
  var import_homepage_default = {
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
      let pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!pathname) pathname = "/index";
      const path = pathname;
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
  return __toCommonJS(import_homepage_exports);
})();
