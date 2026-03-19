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

  // tools/importer/import-msft-homepage.js
  var import_msft_homepage_exports = {};
  __export(import_msft_homepage_exports, {
    default: () => import_msft_homepage_default
  });

  // tools/importer/parsers/advanced-carousel.js
  function parse(element, { document }) {
    const heroSlides = Array.from(
      element.querySelectorAll("reimagine-hero-featured-slider-item")
    );
    const bannerItems = Array.from(
      element.querySelectorAll("reimagine-carousel-item")
    );
    const slides = heroSlides.length > 0 ? heroSlides : bannerItems;
    const slideType = heroSlides.length > 0 ? "hero-carousel-slide" : "banner-carousel-slide";
    const ul = document.createElement("ul");
    slides.forEach((slide, idx) => {
      const li = document.createElement("li");
      const heading = slide.querySelector("h1, h2");
      const headingText = heading ? heading.textContent.replace(/\s+/g, " ").trim() : `Slide ${idx + 1}`;
      li.textContent = headingText;
      ul.appendChild(li);
    });
    const carouselBlock = WebImporter.Blocks.createBlock(document, {
      name: "advanced-carousel",
      cells: [[ul]]
    });
    const slideBlocks = [];
    slides.forEach((slide) => {
      let slideBlock;
      if (slideType === "hero-carousel-slide") {
        slideBlock = buildHeroSlide(slide, document);
      } else {
        slideBlock = buildBannerSlide(slide, document);
      }
      if (slideBlock) {
        slideBlocks.push(slideBlock);
      }
    });
    const fragment = document.createDocumentFragment();
    fragment.appendChild(carouselBlock);
    slideBlocks.forEach((slideBlock) => {
      const hr = document.createElement("hr");
      fragment.appendChild(hr);
      fragment.appendChild(slideBlock);
    });
    element.replaceWith(fragment);
  }
  function buildHeroSlide(slide, document) {
    const picture = slide.querySelector("picture");
    const img = picture || slide.querySelector("img");
    const heading = slide.querySelector("h1, h2");
    const descDiv = slide.querySelector('div[slot="heading-block__content-text"]');
    let descText = "";
    if (descDiv) {
      descText = descDiv.textContent.replace(/\s+/g, " ").trim();
    }
    const ctaLinks = Array.from(slide.querySelectorAll("a[href]"));
    const imageCell = [];
    if (img) imageCell.push(img);
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
      a.textContent = link.textContent.replace(/\s+/g, " ").trim();
      p.appendChild(a);
      textCell.push(p);
    });
    const cells = [];
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
    return WebImporter.Blocks.createBlock(document, { name: "hero-carousel-slide", cells });
  }
  function buildBannerSlide(item, document) {
    const banner = item.querySelector("reimagine-card-banner") || item;
    const picture = banner.querySelector("picture");
    const img = picture || banner.querySelector("img");
    const heading = banner.querySelector("h2, h1");
    const descEl = banner.querySelector('p[slot="text-block__content"]') || banner.querySelector("reimagine-text-block p");
    const descDiv = banner.querySelector('div[slot="heading-block__content-text"]');
    const descText = descEl ? descEl.textContent.replace(/\s+/g, " ").trim() : descDiv ? descDiv.textContent.replace(/\s+/g, " ").trim() : "";
    const ctaLinks = Array.from(banner.querySelectorAll("a[href]"));
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
      a.textContent = link.textContent.replace(/\s+/g, " ").trim();
      p.appendChild(a);
      textCell.push(p);
    });
    if (textCell.length > 0) {
      cells.push([textCell]);
    }
    return WebImporter.Blocks.createBlock(document, { name: "banner-carousel-slide", cells });
  }

  // tools/importer/parsers/hero-carousel-slide.js
  function parse2(element, { document }) {
    const picture = element.querySelector('reimagine-media[slot="ui-shell-media"] picture');
    const img = picture || element.querySelector('reimagine-media[slot="ui-shell-media"] img');
    const heading = element.querySelector("reimagine-heading-block h1, reimagine-heading-block h2");
    const descriptionDiv = element.querySelector('div[slot="heading-block__content-text"]');
    const description = descriptionDiv ? descriptionDiv.querySelector("div") : null;
    const ctaLinks = Array.from(
      element.querySelectorAll("reimagine-button-group reimagine-button a")
    );
    const imageCell = [];
    if (img) imageCell.push(img);
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }
    ctaLinks.forEach((link) => textCell.push(link));
    const cells = [];
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-carousel-slide", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/ai-chat.js
  function parse3(element, { document }) {
    const heading = element.querySelector(".msstore-chatonpage__heading-container h2, h2");
    const input = element.querySelector('input.msstore-chatonpage__text-input, input[type="text"]');
    const placeholderText = input ? input.getAttribute("placeholder") || "" : "";
    const pills = Array.from(
      element.querySelectorAll("button.msstore-chatonpage__prompt-pill")
    );
    const cells = [];
    if (heading) {
      cells.push([heading]);
    }
    if (placeholderText) {
      const p = document.createElement("p");
      p.textContent = placeholderText;
      cells.push([p]);
    }
    if (pills.length > 0) {
      const ul = document.createElement("ul");
      pills.forEach((pill) => {
        const li = document.createElement("li");
        li.textContent = pill.getAttribute("data-pill-value") || pill.textContent.trim();
        ul.appendChild(li);
      });
      cells.push([ul]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "ai-chat", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quick-links.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/cards.js
  function parse5(element, { document }) {
    const featured = element.closest("reimagine-featured");
    if (!featured) {
      const cells2 = [buildCardRow(element, document)];
      const block2 = WebImporter.Blocks.createBlock(document, { name: "cards", cells: cells2 });
      element.replaceWith(block2);
      return;
    }
    const allCards = Array.from(featured.querySelectorAll("reimagine-card-feature"));
    if (allCards.indexOf(element) !== 0) {
      element.remove();
      return;
    }
    const cells = [];
    allCards.forEach((card) => {
      cells.push(buildCardRow(card, document));
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
    allCards.slice(1).forEach((card) => card.remove());
  }
  function buildCardRow(card, document) {
    const picture = card.querySelector("reimagine-media picture");
    const img = picture || card.querySelector("reimagine-media img");
    const imageCell = [];
    if (img) imageCell.push(img);
    const textCell = [];
    const tag = card.querySelector("reimagine-tag");
    if (tag) {
      const badgeText = tag.textContent.trim();
      if (badgeText) {
        const em = document.createElement("em");
        em.textContent = badgeText;
        textCell.push(em);
      }
    }
    const heading = card.querySelector(
      'reimagine-text-block h2[slot="text-block__heading"], reimagine-text-block h3[slot="text-block__heading"], reimagine-text-block h2, reimagine-text-block h3'
    );
    if (heading) textCell.push(heading);
    const desc = card.querySelector(
      'reimagine-text-block p[slot="text-block__content"], reimagine-text-block p'
    );
    if (desc) textCell.push(desc);
    const cta = card.querySelector(
      "reimagine-button a"
    );
    if (cta) {
      const link = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.href || cta.getAttribute("href") || "";
      a.textContent = cta.textContent.trim();
      link.appendChild(a);
      textCell.push(link);
    }
    return [imageCell, textCell];
  }

  // tools/importer/parsers/hero.js
  function parse6(element, { document }) {
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

  // tools/importer/parsers/banner-carousel-slide.js
  function parse7(element, { document }) {
    const cardBanner = element.querySelector("reimagine-card-banner") || element;
    const picture = cardBanner.querySelector("reimagine-media picture");
    const img = picture || cardBanner.querySelector("reimagine-media img");
    const heading = cardBanner.querySelector(
      'h2[slot="text-block__heading"], reimagine-text-block h2, reimagine-heading-block h2, h2'
    );
    const descEl = cardBanner.querySelector(
      'p[slot="text-block__content"], reimagine-text-block p'
    );
    const descText = descEl ? descEl.textContent.trim() : "";
    const descDiv = !descText ? cardBanner.querySelector('div[slot="heading-block__content-text"]') : null;
    const fallbackDescText = descDiv ? descDiv.textContent.trim() : "";
    const finalDescText = descText || fallbackDescText;
    const ctaLinks = Array.from(
      cardBanner.querySelectorAll("reimagine-button-group reimagine-button a")
    );
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const textCell = [];
    if (heading) textCell.push(heading);
    if (finalDescText) {
      const p = document.createElement("p");
      p.textContent = finalDescText;
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
    const block = WebImporter.Blocks.createBlock(document, { name: "banner-carousel-slide", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-follow.js
  function parse8(element, { document }) {
    const logoFooter = element.querySelector("reimagine-logo-footer") || element;
    const heading = logoFooter.querySelector(
      'h2[slot="text-block__heading"], reimagine-text-block h2, h2'
    );
    const reimagineLinks = Array.from(logoFooter.querySelectorAll("reimagine-link"));
    const cells = [];
    if (heading) {
      cells.push([heading]);
    }
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
    const block = WebImporter.Blocks.createBlock(document, { name: "social-follow", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/msft-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ['link[rel="stylesheet"]']);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "#headerArea",
        "#footerArea",
        "#uhfHeader",
        "#uhfFooter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#msccBannerV2",
        "#uhfCookieAlert",
        "#onetrust-consent-sdk",
        '[id*="cookie-banner"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        "#uhfSkipToMain",
        "#shell-cart-count"
      ]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
      WebImporter.DOMUtils.remove(element, [
        ".msstore-chatonpage-overlay",
        '[class*="store-assistant"]',
        '[class*="chat-widget"]'
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing.com") || src.includes("action/0?")) {
          img.remove();
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (/^(Back to Top|Need help\?|Chat now|No thanks|Chat nowNo thanks|Can we help you\?|Store Assistant is available|Let's chat)$/i.test(text) || /^Need help\?\s*Let/i.test(text)) {
          p.remove();
        }
      });
      element.querySelectorAll("h3").forEach((h3) => {
        if (/^Can we help you\?$/i.test(h3.textContent.trim())) {
          h3.remove();
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim() === "Trace Id is missing") {
          p.remove();
        }
      });
      element.querySelectorAll("*").forEach((el) => {
        const attrs = Array.from(el.attributes || []);
        attrs.forEach((attr) => {
          if (attr.name.startsWith("data-bi-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/msft-sections.js
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument;
    if (hookName === "beforeTransform") {
      sections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectorList) {
          try {
            const el = element.querySelector(sel);
            if (el) {
              el.setAttribute("data-section-id", section.id);
              if (section.style) {
                el.setAttribute("data-section-style", section.style);
              }
              break;
            }
          } catch (e) {
          }
        }
      });
    }
    if (hookName === "afterTransform") {
      const markedSections = Array.from(
        element.querySelectorAll("[data-section-id]")
      );
      markedSections.reverse().forEach((sectionEl) => {
        const sectionId = sectionEl.getAttribute("data-section-id");
        const style = sectionEl.getAttribute("data-section-style");
        sectionEl.removeAttribute("data-section-id");
        sectionEl.removeAttribute("data-section-style");
        if (style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(
            document,
            { name: "Section Metadata", cells: { style } }
          );
          sectionEl.after(sectionMetadata);
        }
        const isFirst = sectionId === sections[0].id;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-msft-homepage.js
  var parsers = {
    "advanced-carousel": parse,
    "hero-carousel-slide": parse2,
    "ai-chat": parse3,
    "quick-links": parse4,
    "cards": parse5,
    "hero": parse6,
    "banner-carousel-slide": parse7,
    "social-follow": parse8
  };
  var PAGE_TEMPLATE = {
    name: "msft-homepage",
    urls: [
      "https://www.microsoft.com/en-us"
    ],
    description: "Microsoft corporate homepage with hero banners, product highlights, and promotional content",
    blocks: [
      {
        name: "advanced-carousel",
        instances: [
          "div.hero-featured-slider reimagine-carousel",
          "div.ui-shell reimagine-carousel"
        ]
      },
      {
        name: "hero-carousel-slide",
        instances: [
          "div.hero-featured-slider reimagine-carousel-item reimagine-hero-featured-slider-item"
        ]
      },
      {
        name: "ai-chat",
        instances: [
          "div.msstore-chatonpage.contained"
        ]
      },
      {
        name: "quick-links",
        instances: [
          "div.quicklinks reimagine-secondary-nav[configuration='quicklinks']"
        ]
      },
      {
        name: "cards",
        instances: [
          "div.featured[data-component-id='71510296gldd3806gafb03daf4f77h07'] reimagine-card-feature",
          "div.featured[data-component-id='29710086fcdd3366caca03daf4f66b57'] reimagine-card-feature",
          "div.featured[data-component-id='29710086fcdd3366caca03daf4f66b57'] reimagine-card-feature"
        ]
      },
      {
        name: "hero",
        instances: [
          "reimagine-banner-featured[background='base-neutral'] reimagine-card-banner"
        ]
      },
      {
        name: "banner-carousel-slide",
        instances: [
          "div.ui-shell reimagine-carousel-item reimagine-card-banner"
        ]
      },
      {
        name: "social-follow",
        instances: [
          "div.logo-footer reimagine-logo-footer"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Announcement Bar",
        selector: "div[ocr-component-name='cascade-announcement-wc']",
        style: "announcement-bar",
        blocks: [],
        defaultContent: [
          "reimagine-announcement p[slot='announcement__label']",
          "reimagine-announcement reimagine-link[slot='announcement__link']"
        ]
      },
      {
        id: "section-2",
        name: "Hero Carousel",
        selector: "div.hero-featured-slider",
        style: null,
        blocks: [
          "advanced-carousel",
          "hero-carousel-slide"
        ],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "AI Assistant / Chat",
        selector: "div.banner-featured.tabs.panelcontainer:has(div.msstore-chatonpage)",
        style: null,
        blocks: [
          "ai-chat"
        ],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Product Category Navigation",
        selector: "div.quicklinks",
        style: null,
        blocks: [
          "quick-links"
        ],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Content Promotion Cards",
        selector: "div.featured[data-component-id='71510296gldd3806gafb03daf4f77h07']",
        style: null,
        blocks: [
          "cards"
        ],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Full-Width Promotional Banner",
        selector: "div.banner-featured.tabs.panelcontainer:has(reimagine-banner-featured[background='base-neutral'])",
        style: "dark",
        blocks: [
          "hero"
        ],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "For Business Section",
        selector: "div.featured[data-component-id='29710086fcdd3366caca03daf4f66b57']:has(reimagine-featured[configuration='4-col-even-2'])",
        style: "light-grey",
        blocks: [
          "cards"
        ],
        defaultContent: [
          "reimagine-featured[background='base-fade'] reimagine-heading-block[data-en-title='For business'] h2"
        ]
      },
      {
        id: "section-8",
        name: "Get to Know AI and Copilot Section",
        selector: "div.featured[data-component-id='29710086fcdd3366caca03daf4f66b57']:has(reimagine-featured[configuration='3-col-even'])",
        style: "light-grey",
        blocks: [
          "cards"
        ],
        defaultContent: [
          "reimagine-featured[configuration='3-col-even'] reimagine-heading-block h2"
        ]
      },
      {
        id: "section-9",
        name: "Bottom Carousel",
        selector: "div.ui-shell[data-component-id='78886cafd6af66b1105378432d26acef']",
        style: null,
        blocks: [
          "advanced-carousel",
          "banner-carousel-slide"
        ],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Follow Microsoft",
        selector: "div.logo-footer[data-component-id='6fd6abbfb7d19a0d568b967c721295ee']",
        style: null,
        blocks: [
          "social-follow"
        ],
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_msft_homepage_default = {
    /**
     * Main transformation function using the one-input / multiple-outputs pattern.
     * Orchestrates transformers and parsers to convert the Microsoft homepage
     * into AEM Edge Delivery Services format.
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/en-us"
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
  return __toCommonJS(import_msft_homepage_exports);
})();
