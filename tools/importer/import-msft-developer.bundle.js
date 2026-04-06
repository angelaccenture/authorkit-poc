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

  // tools/importer/import-msft-developer.js
  var import_msft_developer_exports = {};
  __export(import_msft_developer_exports, {
    default: () => import_msft_developer_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const cardBanner = element.querySelector("reimagine-card-banner") || element;
    const picture = cardBanner.querySelector("reimagine-media picture");
    const img = picture || cardBanner.querySelector("reimagine-media img");
    const heading = cardBanner.querySelector(
      "reimagine-heading-block h2, reimagine-heading-block h1"
    );
    const descDiv = cardBanner.querySelector('div[slot="heading-block__content-text"]');
    const descText = descDiv ? descDiv.textContent.trim() : "";
    const ctaLinks = Array.from(
      cardBanner.querySelectorAll("reimagine-button-group reimagine-button a")
    );
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const textCell = [];
    if (heading) textCell.push(heading);
    if (descText) {
      const p = document.createElement("p");
      p.textContent = descText;
      textCell.push(p);
    }
    ctaLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href || link.getAttribute("href") || "";
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      textCell.push(p);
    });
    if (textCell.length > 0) {
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card.js
  function parse2(element, { document }) {
    const cardEl = element.classList.contains("card") ? element : element.querySelector(".card");
    if (!cardEl) {
      element.remove();
      return;
    }
    const img = cardEl.querySelector(".card__media img");
    const imageCell = [];
    if (img) imageCell.push(img);
    const textCell = [];
    const badgeEl = cardEl.querySelector(".block-feature__label");
    if (badgeEl) {
      const badgeText = badgeEl.textContent.trim();
      if (badgeText) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = badgeText;
        p.appendChild(em);
        textCell.push(p);
      }
    }
    const heading = cardEl.querySelector(".block-feature__title h3, .block-feature__title h4");
    if (heading) {
      const h3 = document.createElement("h3");
      h3.textContent = heading.textContent.trim();
      textCell.push(h3);
    }
    const descEl = cardEl.querySelector(".block-feature__paragraph");
    if (descEl) {
      const clone = descEl.cloneNode(true);
      clone.querySelectorAll("sup").forEach((s) => s.remove());
      const text = clone.textContent.trim();
      if (text) {
        const p = document.createElement("p");
        p.textContent = text;
        textCell.push(p);
      }
    }
    const cta = cardEl.querySelector(".action a.btn, .block-slim a.btn");
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.href || cta.getAttribute("href") || "";
      const btnText = cta.querySelector(".btn__text");
      a.textContent = (btnText ? btnText.textContent : cta.textContent).trim();
      p.appendChild(a);
      textCell.push(p);
    }
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quick-links.js
  function parse3(element, { document }) {
    const navItems = Array.from(
      element.querySelectorAll('reimagine-secondary-nav-item[configuration="quicklink"], reimagine-secondary-nav-item')
    );
    const cells = [];
    navItems.forEach((item) => {
      const href = item.getAttribute("href") || "";
      const labelText = item.getAttribute("enlabeltext") || item.textContent.trim();
      if (href && labelText) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = labelText;
        cells.push([link]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "quick-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-quote.js
  function parse4(element, { document }) {
    const heading = element.querySelector("h2");
    const paragraphs = element.querySelectorAll("p");
    const productList = element.querySelector("ul, ol");
    const videoThumb = element.querySelector('img[src*="video"], img[src*="thumbnail"], img[src*="story"]');
    const videoLink = element.querySelector('a[href*="youtube"], a[href*="video"], button[data-href]');
    const cells = [];
    const quoteContent = [];
    if (heading) quoteContent.push(heading);
    paragraphs.forEach((p) => quoteContent.push(p));
    if (productList) quoteContent.push(productList);
    cells.push([quoteContent]);
    const videoContent = [];
    if (videoThumb) videoContent.push(videoThumb);
    if (videoLink) {
      const link = document.createElement("a");
      link.href = videoLink.href || videoLink.dataset.href || "#";
      link.textContent = "Watch video";
      videoContent.push(link);
    }
    if (videoContent.length > 0) {
      cells.push([videoContent]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-blog.js
  function parse5(element, { document }) {
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

  // tools/importer/parsers/social-follow.js
  function parse6(element, { document }) {
    const isSocialFollow = element.classList.contains("socialfollow") || element.querySelector(".socialfollow");
    const logoFooter = element.querySelector("reimagine-logo-footer") || element;
    const cells = [];
    if (isSocialFollow) {
      const container = element.querySelector(".socialfollow") || element;
      const heading = container.querySelector("h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        cells.push([h2]);
      }
      const socialLinks = Array.from(container.querySelectorAll("ul.list-inline > li > a"));
      socialLinks.forEach((a) => {
        const img = a.querySelector("img");
        const href = a.href || a.getAttribute("href") || "";
        const platformName = img ? img.alt || img.title || "Link" : "Link";
        const imageCell = [];
        if (img) imageCell.push(img);
        const link = document.createElement("a");
        link.href = href;
        link.textContent = platformName.replace(" logo", "");
        cells.push([imageCell, link]);
      });
    } else {
      const heading = logoFooter.querySelector(
        'h2[slot="text-block__heading"], reimagine-text-block h2, h2'
      );
      if (heading) {
        cells.push([heading]);
      }
      const reimagineLinks = Array.from(logoFooter.querySelectorAll("reimagine-link"));
      reimagineLinks.forEach((rl) => {
        const a = rl.querySelector("a");
        const img = rl.querySelector("img");
        if (!a) return;
        const href = a.href || a.getAttribute("href") || "";
        const ariaLabel = a.getAttribute("aria-label") || "";
        const platformMatch = ariaLabel.match(/on\s+(\w+)/i);
        const platformName = platformMatch ? platformMatch[1] : img ? img.alt : "Link";
        const imageCell = [];
        if (img) imageCell.push(img);
        const link = document.createElement("a");
        link.href = href;
        link.textContent = platformName;
        cells.push([imageCell, link]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "social-follow", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/msft-developer-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#msccBannerV2",
        "#uhfCookieAlert",
        '[class*="cookie-banner"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        'svg[style*="display: none"]',
        '[aria-hidden="true"]:not(img)'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "#headerArea",
        "#headerRegion",
        "header.c-uhfh",
        "footer#uhf-footer",
        "#footerArea",
        "#footerRegion"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        "#uhfSkipToMain",
        'a[href="javascript:void(0)"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".carousel__controls",
        ".carousel__announcement-text",
        "a.sr-only-focusable"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".tab-arrows",
        ".pill-bar__arrow-prev-bg",
        ".pill-bar__arrow-next-bg"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".sr-only:not(.carousel__announcement-text)"
      ]);
      const siteBanners = element.querySelector(".site-banners");
      if (siteBanners) {
        while (siteBanners.firstChild) {
          siteBanners.parentNode.insertBefore(siteBanners.firstChild, siteBanners);
        }
        siteBanners.remove();
      }
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript", "script"]);
    }
  }

  // tools/importer/transformers/msft-developer-sections.js
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

  // tools/importer/import-msft-developer.js
  var parsers = {
    "hero": parse,
    "card": parse2,
    "quick-links": parse3,
    "video-quote": parse4,
    "cards-blog": parse5,
    "social-follow": parse6
  };
  var PAGE_TEMPLATE = {
    name: "msft-developer",
    description: "Microsoft Developer homepage",
    urls: ["https://developer.microsoft.com/en-us/"],
    blocks: [
      { name: "hero", instances: ["div.section-master--blade-hero-card-carousel"] },
      { name: "card", instances: ["div.card-content", "div.card-promo"] },
      { name: "quick-links", instances: ["section#languages div.layout"] },
      { name: "video-quote", instances: ["section#developer-story, [class*=developer-story]"] },
      { name: "cards-blog", instances: ["section#blogs div.card-content"] },
      { name: "social-follow", instances: ["div.social-links, [class*=social-links]"] }
    ],
    sections: [
      { id: "section-1", name: "Hero Banner", selector: "div.section-master--blade-hero-card-carousel", style: "dark", blocks: ["hero"], defaultContent: [] },
      { id: "section-2", name: "Featured Products", selector: "div.section-master--blade-card-carousel:has(.pill-bar)", style: null, blocks: ["card"], defaultContent: ["h3", "h2"] },
      { id: "section-3", name: "Events Banner Carousel", selector: "#banner-carousel", style: null, blocks: ["card"], defaultContent: [] },
      { id: "section-4", name: "News & Updates", selector: ["section:has(#discover-whats-new-carousel)", "[class*=whats-new]"], style: null, blocks: ["card"], defaultContent: ["h3", "h2"] },
      { id: "section-5", name: "Languages", selector: "section#languages", style: null, blocks: ["quick-links"], defaultContent: ["h3", "h2", "p"] },
      { id: "section-6", name: "Communities", selector: "section#communities", style: null, blocks: ["card"], defaultContent: ["h3", "h2"] },
      { id: "section-7", name: "Resource Hubs", selector: "section#hubs", style: null, blocks: ["card"], defaultContent: ["h3", "h2"] },
      { id: "section-8", name: "Developer Story", selector: ["section#developer-story", "[class*=developer-story]"], style: "light-grey", blocks: ["video-quote"], defaultContent: [] },
      { id: "section-9", name: "Blog", selector: "section#blogs", style: null, blocks: ["cards-blog"], defaultContent: ["h2", "a"] },
      { id: "section-10", name: "Events", selector: "section#events", style: null, blocks: ["cards-blog"], defaultContent: ["h3", "h2", "a"] },
      { id: "section-11", name: "Newsletter", selector: "section#source-newsletter", style: "dark", blocks: [], defaultContent: ["h2", "p", "a"] },
      { id: "section-12", name: "Learn With Us", selector: "section#learn", style: null, blocks: ["card"], defaultContent: ["h3", "h2"] },
      { id: "section-13", name: "Social Follow", selector: ["div.social-links", "[class*=social-links]"], style: null, blocks: ["social-follow"], defaultContent: [] }
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
  var import_msft_developer_default = {
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
  return __toCommonJS(import_msft_developer_exports);
})();
