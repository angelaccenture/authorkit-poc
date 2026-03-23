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

  // tools/importer/import-microsoft-365.js
  var import_microsoft_365_exports = {};
  __export(import_microsoft_365_exports, {
    default: () => import_microsoft_365_default
  });

  // tools/importer/parsers/hero-m365.js
  function parse(element, { document }) {
    const bgImg = element.querySelector("div.section-master__image img");
    const eyebrowEl = element.querySelector(".block-heading__eyebrow");
    const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : "";
    const h1 = element.querySelector("h1");
    const headingText = h1 ? h1.textContent.trim() : "";
    const descEl = element.querySelector(".block-heading__paragraph");
    let descText = "";
    if (descEl) {
      const descDiv = descEl.querySelector("div > div");
      if (descDiv) {
        const clone = descDiv.cloneNode(true);
        clone.querySelectorAll("sup").forEach((s) => s.remove());
        descText = clone.textContent.trim();
      }
    }
    const ctaLinks = Array.from(
      element.querySelectorAll(".block-heading__button-group a.btn")
    );
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const textCell = [];
    if (eyebrowText) {
      const eyebrow = document.createElement("p");
      eyebrow.textContent = eyebrowText;
      textCell.push(eyebrow);
    }
    if (headingText) {
      const heading = document.createElement("h1");
      heading.textContent = headingText;
      textCell.push(heading);
    }
    if (descText) {
      const p = document.createElement("p");
      p.textContent = descText;
      textCell.push(p);
    }
    ctaLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href || link.getAttribute("href") || "";
      const btnText = link.querySelector(".btn__text");
      a.textContent = (btnText ? btnText.textContent : link.textContent).trim();
      p.appendChild(a);
      textCell.push(p);
    });
    if (textCell.length > 0) {
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero (center)", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll("li.ocr-accordion-item"));
    const wrapper = document.createElement("div");
    items.forEach((item) => {
      const titleEl = item.querySelector("h3");
      if (titleEl) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        wrapper.appendChild(h3);
      }
      const bodyEl = item.querySelector(".ocr-accordion-item__body");
      if (bodyEl) {
        const textDiv = bodyEl.querySelector("div > div");
        if (textDiv) {
          const clone = textDiv.cloneNode(true);
          clone.querySelectorAll("sup").forEach((s) => s.remove());
          const text = clone.textContent.trim();
          if (text) {
            const p = document.createElement("p");
            p.textContent = text;
            wrapper.appendChild(p);
          }
        }
      }
    });
    const firstImg = element.querySelector(".ocr-accordion-item__body img");
    if (firstImg) {
      wrapper.appendChild(firstImg);
    }
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/teaser.js
  function parse3(element, { document }) {
    const cardH = element.querySelector(".card-horizontal") || element;
    const img = cardH.querySelector(".card-horizontal__media img");
    const badgeEl = cardH.querySelector(".block-feature__label");
    const badgeText = badgeEl ? badgeEl.textContent.trim() : "";
    const headingEl = cardH.querySelector(".block-feature__title h3");
    const headingText = headingEl ? headingEl.textContent.trim() : "";
    const descEl = cardH.querySelector(".block-feature__paragraph");
    let descText = "";
    if (descEl) {
      const clone = descEl.cloneNode(true);
      clone.querySelectorAll("sup").forEach((s) => s.remove());
      descText = clone.textContent.trim();
    }
    const ctaEl = cardH.querySelector(".action a.btn, .block-slim a.btn");
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const textCell = [];
    if (badgeText) {
      const badge = document.createElement("em");
      badge.textContent = badgeText;
      textCell.push(badge);
    }
    if (headingText) {
      const h3 = document.createElement("h3");
      h3.textContent = headingText;
      textCell.push(h3);
    }
    if (descText) {
      const p = document.createElement("p");
      p.textContent = descText;
      textCell.push(p);
    }
    if (ctaEl) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaEl.href || ctaEl.getAttribute("href") || "";
      const btnText = ctaEl.querySelector(".btn__text");
      a.textContent = (btnText ? btnText.textContent : ctaEl.textContent).trim();
      p.appendChild(a);
      textCell.push(p);
    }
    if (textCell.length > 0) {
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card.js
  function parse4(element, { document }) {
    const cardEl = element.classList.contains("card") ? element : element.querySelector(".card");
    if (!cardEl) {
      element.remove();
      return;
    }
    const container = element.closest(".three-up-cards") || element.closest(".cta-stacked--vertical-cards");
    if (container) {
      const allCards = Array.from(container.querySelectorAll(".three-up-cards__card .card, .card"));
      const uniqueCards = [...new Set(allCards)];
      const myIndex = uniqueCards.indexOf(cardEl);
      if (myIndex > 0) {
        element.remove();
        return;
      }
      const cells2 = [];
      const wrappers = Array.from(container.querySelectorAll(".three-up-cards__card"));
      wrappers.forEach((wrapper) => {
        const card = wrapper.querySelector(".card") || wrapper;
        cells2.push(buildCardRow(card, document));
      });
      const block2 = WebImporter.Blocks.createBlock(document, { name: "card", cells: cells2 });
      element.replaceWith(block2);
      wrappers.slice(1).forEach((w) => w.remove());
      return;
    }
    const cells = [buildCardRow(cardEl, document)];
    const block = WebImporter.Blocks.createBlock(document, { name: "card", cells });
    element.replaceWith(block);
  }
  function buildCardRow(card, document) {
    const img = card.querySelector(".card__media img");
    const imageCell = [];
    if (img) imageCell.push(img);
    const textCell = [];
    const badgeEl = card.querySelector(".block-feature__label");
    if (badgeEl) {
      const badgeText = badgeEl.textContent.trim();
      if (badgeText) {
        const em = document.createElement("em");
        em.textContent = badgeText;
        textCell.push(em);
      }
    }
    const heading = card.querySelector(".block-feature__title h3, .block-feature__title h4");
    if (heading) {
      const h3 = document.createElement("h3");
      h3.textContent = heading.textContent.trim();
      textCell.push(h3);
    }
    const descEl = card.querySelector(".block-feature__paragraph");
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
    const cta = card.querySelector(".action a.btn, .block-slim a.btn");
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.href || cta.getAttribute("href") || "";
      const btnText = cta.querySelector(".btn__text");
      a.textContent = (btnText ? btnText.textContent : cta.textContent).trim();
      p.appendChild(a);
      textCell.push(p);
    }
    return [imageCell, textCell];
  }

  // tools/importer/parsers/card-app.js
  function parse5(element, { document }) {
    const cardEl = element.classList.contains("card") ? element : element.querySelector(".card");
    if (!cardEl) {
      element.remove();
      return;
    }
    const tabPanel = element.closest(".tab-panel");
    if (tabPanel && !tabPanel.classList.contains("active")) {
      element.remove();
      return;
    }
    const cardsContainer = element.closest(".card-grid__cards");
    if (cardsContainer) {
      const allCards = Array.from(cardsContainer.querySelectorAll(".layout__col > .card"));
      const myIndex = allCards.indexOf(cardEl);
      if (myIndex > 0) {
        element.remove();
        return;
      }
      const cells2 = [];
      allCards.forEach((card) => {
        cells2.push(buildAppCardRow(card, document));
      });
      const block2 = WebImporter.Blocks.createBlock(document, { name: "card-app", cells: cells2 });
      element.replaceWith(block2);
      allCards.slice(1).forEach((c) => {
        const wrapper = c.closest(".layout__col");
        if (wrapper) wrapper.remove();
        else c.remove();
      });
      return;
    }
    const cells = [buildAppCardRow(cardEl, document)];
    const block = WebImporter.Blocks.createBlock(document, { name: "card-app", cells });
    element.replaceWith(block);
  }
  function buildAppCardRow(card, document) {
    const icon = card.querySelector(".block-feature__badge img");
    const imageCell = [];
    if (icon) imageCell.push(icon);
    const textCell = [];
    const nameEl = card.querySelector(".block-feature__title h4");
    if (nameEl) {
      const h3 = document.createElement("h3");
      h3.textContent = nameEl.textContent.trim();
      textCell.push(h3);
    }
    const descEl = card.querySelector(".block-feature__paragraph");
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
    const linkEl = card.querySelector(".action a.link, .action a.link-inline");
    if (linkEl) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = linkEl.href || linkEl.getAttribute("href") || "";
      const linkText = linkEl.querySelector(".link__text");
      a.textContent = (linkText ? linkText.textContent : linkEl.textContent).trim();
      p.appendChild(a);
      textCell.push(p);
    }
    return [imageCell, textCell];
  }

  // tools/importer/parsers/pricing-cards.js
  function parse6(element, { document }) {
    const tabPanel = element.closest(".tab-panel");
    if (tabPanel && !tabPanel.classList.contains("active")) {
      element.remove();
      return;
    }
    const carousel = element.querySelector(".carousel--card-grid .carousel") || element.querySelector(".carousel") || element;
    const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
    const cells = [];
    slides.forEach((slide) => {
      const planDetail = slide.querySelector(".card-plan-detail");
      if (!planDetail) return;
      const rowContent = [];
      const planName = planDetail.querySelector("h3.oc-product-title");
      if (planName) {
        const h3 = document.createElement("h3");
        h3.textContent = planName.textContent.trim();
        rowContent.push(h3);
      }
      const price = planDetail.querySelector("span.oc-displayListPrice");
      const unit = planDetail.querySelector("span.oc-displayUnit");
      if (price) {
        let priceText = price.textContent.trim();
        if (unit) priceText += unit.textContent.trim();
        const pStrong = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = priceText;
        pStrong.appendChild(strong);
        rowContent.push(pStrong);
      }
      const skuButtons = planDetail.querySelector(".sku__buttons");
      if (skuButtons) {
        const ctaLinks = Array.from(skuButtons.querySelectorAll("a.btn"));
        ctaLinks.forEach((link) => {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href") || "";
          const btnText = link.querySelector(".btn__text");
          a.textContent = (btnText ? btnText.textContent : link.textContent).trim();
          p.appendChild(a);
          rowContent.push(p);
        });
      }
      const featureHeading = planDetail.querySelector(".block-feature__title h4");
      if (featureHeading) {
        const h4 = document.createElement("h4");
        h4.textContent = featureHeading.textContent.trim();
        rowContent.push(h4);
      }
      const featureItems = Array.from(
        planDetail.querySelectorAll(".card-plan-detail__content .block-items-list > .block-items-list__item")
      );
      if (featureItems.length > 0) {
        const ul = document.createElement("ul");
        featureItems.forEach((item) => {
          const titleEl = item.querySelector(".list-item__content-title");
          if (titleEl) {
            const clone = titleEl.cloneNode(true);
            clone.querySelectorAll(
              ".popover__content, .popover__info, .popover__card, button, .ocr-icon-svg--info-filled, style, script, link"
            ).forEach((el) => el.remove());
            const text = clone.textContent.trim();
            if (text) {
              const li = document.createElement("li");
              li.textContent = text;
              ul.appendChild(li);
            }
          }
        });
        if (ul.children.length > 0) {
          rowContent.push(ul);
        }
      }
      const badges = Array.from(
        planDetail.querySelectorAll(".card-plan-detail__badges .popover__badge img")
      );
      if (badges.length > 0) {
        const badgeP = document.createElement("p");
        badges.forEach((badge, i) => {
          if (i > 0) badgeP.appendChild(document.createTextNode(" "));
          const span = document.createElement("span");
          span.textContent = badge.alt || badge.title || "";
          badgeP.appendChild(span);
        });
        rowContent.push(badgeP);
      }
      if (rowContent.length > 0) {
        cells.push([rowContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "pricing-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/advanced-accordion.js
  function parse7(element, { document }) {
    const faqContainer = element.querySelector(".ocr-faq") || element;
    const faqItems = Array.from(faqContainer.querySelectorAll("li.ocr-faq-item"));
    const ul = document.createElement("ul");
    faqItems.forEach((item) => {
      const titleEl = item.querySelector(".ocr-faq-item__header--title h3");
      if (titleEl) {
        const li = document.createElement("li");
        li.textContent = titleEl.textContent.trim();
        ul.appendChild(li);
      }
    });
    const cells = [[ul]];
    const block = WebImporter.Blocks.createBlock(document, { name: "advanced-accordion", cells });
    const wrapper = document.createElement("div");
    wrapper.appendChild(block);
    faqItems.forEach((item) => {
      const titleEl = item.querySelector(".ocr-faq-item__header--title h3");
      const bodyEl = item.querySelector(".ocr-faq-item__body");
      if (!titleEl) return;
      wrapper.appendChild(document.createElement("hr"));
      const h3 = document.createElement("h3");
      h3.textContent = titleEl.textContent.trim();
      wrapper.appendChild(h3);
      if (bodyEl) {
        const answerDiv = bodyEl.querySelector("div > div") || bodyEl;
        const clone = answerDiv.cloneNode(true);
        clone.querySelectorAll("style, script, link").forEach((el) => el.remove());
        const p = document.createElement("p");
        clone.childNodes.forEach((node) => {
          if (node.nodeType === 3) {
            const text = node.textContent;
            if (text.trim()) p.appendChild(document.createTextNode(text));
          } else if (node.nodeName === "A") {
            const a = document.createElement("a");
            a.href = node.href || node.getAttribute("href") || "";
            a.textContent = node.textContent.trim();
            p.appendChild(a);
          } else {
            const text = node.textContent;
            if (text.trim()) p.appendChild(document.createTextNode(text));
          }
        });
        if (p.textContent.trim()) {
          wrapper.appendChild(p);
        }
      }
    });
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/social-follow.js
  function parse8(element, { document }) {
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

  // tools/importer/transformers/msft-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ['link[rel="stylesheet"]']);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      WebImporter.DOMUtils.remove(element, ["template"]);
      WebImporter.DOMUtils.remove(element, ["div.reimagine-modal"]);
      WebImporter.DOMUtils.remove(element, ["div.empty-slide"]);
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

  // tools/importer/import-microsoft-365.js
  var parsers = {
    "hero-m365": parse,
    "columns": parse2,
    "teaser": parse3,
    "card": parse4,
    "card-app": parse5,
    "pricing-cards": parse6,
    "advanced-accordion": parse7,
    "social-follow": parse8
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "microsoft-365",
    description: "Microsoft 365 product landing page showcasing subscription plans, features, and pricing",
    urls: [
      "https://www.microsoft.com/en-us/microsoft-365"
    ],
    blocks: [
      {
        name: "hero-m365",
        instances: ["div.section-master--bg-image.section-master--blade-hero-slim"]
      },
      {
        name: "columns",
        instances: ["div.ocr-accordion.accordion--vertical-product"]
      },
      {
        name: "teaser",
        instances: ["div.card-horizontal-container"]
      },
      {
        name: "card",
        instances: [
          "div.cta-stacked--vertical-cards .card",
          "div.section-master:has(#Get-started) .three-up-cards .card"
        ]
      },
      {
        name: "card-app",
        instances: ["div.card-grid__cards .card"]
      },
      {
        name: "pricing-cards",
        instances: ["div.carousel.carousel--card-grid"]
      },
      {
        name: "advanced-accordion",
        instances: ["div.ocr-faq"]
      },
      {
        name: "social-follow",
        instances: ["div.socialfollow"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Announcement Bar",
        selector: "div.ocr-announcement-banner",
        style: "announcement-bar",
        blocks: [],
        defaultContent: [
          "section.announcement-banner .announcement-banner__content",
          "section.announcement-banner .announcement-banner__action a"
        ]
      },
      {
        id: "section-2",
        name: "Hero",
        selector: "div.section-master--bg-image.section-master--blade-hero-slim",
        style: null,
        blocks: ["hero-m365"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Copilot Features",
        selector: "div.section-master:has(#How-it-works)",
        style: null,
        blocks: ["columns"],
        defaultContent: [
          "#How-it-works .block-heading__eyebrow",
          "#How-it-works h2",
          "a#action-ocd6d02"
        ]
      },
      {
        id: "section-4",
        name: "News / Discover",
        selector: "div.section-master:has(#news)",
        style: null,
        blocks: ["teaser", "card"],
        defaultContent: ["#news h2"]
      },
      {
        id: "section-5",
        name: "What's Included",
        selector: "div.section-master:has(#Whats-included)",
        style: "light-grey",
        blocks: ["card-app"],
        defaultContent: [
          "#Whats-included .block-heading__eyebrow",
          "#Whats-included h2",
          "a#action-ocd6d0"
        ]
      },
      {
        id: "section-6",
        name: "Plans / Pricing",
        selector: "div.product-plan-cards",
        style: null,
        blocks: ["pricing-cards"],
        defaultContent: [
          "#Plans .block-heading__eyebrow",
          "#Plans h2"
        ]
      },
      {
        id: "section-7",
        name: "Get Started",
        selector: "div.section-master:has(#Get-started)",
        style: null,
        blocks: ["card"],
        defaultContent: [
          "#Get-started .block-heading__eyebrow",
          "#Get-started h2"
        ]
      },
      {
        id: "section-8",
        name: "FAQ",
        selector: "div.section-master:has(#FAQ)",
        style: null,
        blocks: ["advanced-accordion"],
        defaultContent: ["#FAQ h2"]
      },
      {
        id: "section-9",
        name: "Legal Disclaimers",
        selector: "div.section-master:has(.footnote)",
        style: null,
        blocks: [],
        defaultContent: ["div.footnote"]
      },
      {
        id: "section-10",
        name: "Follow Microsoft 365",
        selector: "div.section-master.bg--base-neutral:has(.socialfollow)",
        style: null,
        blocks: ["social-follow"],
        defaultContent: []
      }
    ]
  };
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
  var import_microsoft_365_default = {
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
  return __toCommonJS(import_microsoft_365_exports);
})();
