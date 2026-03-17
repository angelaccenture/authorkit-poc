var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/transformers/ms-blog-article-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    const { document } = payload;
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
        ".c-social",
        "aside#secondary",
        '[data-grid="col-4"]:has(aside)'
      ]);
      const article = element.querySelector("article");
      if (article) {
        const entryContent = article.querySelector(".entry-content");
        const entryHeader = article.querySelector(".entry-header");
        const fragment = document.createDocumentFragment();
        const h1 = entryHeader ? entryHeader.querySelector("h1") : null;
        if (h1) {
          fragment.appendChild(h1.cloneNode(true));
        }
        const metaText = entryHeader ? entryHeader.querySelector("p.c-meta-text, p:has(time)") : null;
        if (metaText) {
          const datePara = document.createElement("p");
          datePara.className = "article-date";
          const time = metaText.querySelector("time");
          const authorLink = metaText.querySelector("a");
          const parts = [];
          if (time) parts.push(time.textContent.trim());
          if (authorLink) parts.push(authorLink.textContent.trim());
          datePara.textContent = parts.join(" | ");
          fragment.appendChild(datePara);
        }
        const shareList = entryHeader ? entryHeader.querySelector("ul") : null;
        if (shareList) {
          const ul = document.createElement("ul");
          ul.className = "article-share";
          const links = shareList.querySelectorAll("a");
          const iconMap = { facebook: "Facebook", twitter: "X", linkedin: "LinkedIn", threads: "Threads" };
          links.forEach((link) => {
            const href = link.getAttribute("href") || "";
            let label = "";
            for (const [key, val] of Object.entries(iconMap)) {
              if (href.includes(key)) {
                label = val;
                break;
              }
            }
            if (label) {
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.href = href;
              a.textContent = label;
              a.setAttribute("target", "_blank");
              li.appendChild(a);
              ul.appendChild(li);
            }
          });
          if (ul.children.length > 0) {
            fragment.appendChild(ul);
          }
        }
        const heroImg = article.querySelector(":scope > img, .entry-content-hero img");
        if (heroImg) {
          const p = document.createElement("p");
          p.className = "article-hero";
          p.appendChild(heroImg.cloneNode(true));
          fragment.appendChild(p);
        }
        if (entryContent) {
          Array.from(entryContent.children).forEach((child) => {
            fragment.appendChild(child.cloneNode(true));
          });
        }
        const main = element.querySelector("main") || element;
        main.textContent = "";
        main.appendChild(fragment);
      }
    }
  }

  // tools/importer/import-ms-blog-article.js
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "ms-blog-article",
    description: "Microsoft Blog article page with post content, author info, and related posts",
    urls: [
      "https://blogs.microsoft.com/blog/2026/03/17/announcing-copilot-leadership-update/",
      "https://blogs.microsoft.com/blog/2026/03/16/microsoft-at-nvidia-gtc-new-solutions-for-microsoft-foundry-azure-ai-infrastructure-and-physical-ai/",
      "https://blogs.microsoft.com/blog/2026/03/12/microsoft-announces-experiences-devices-leadership-changes/",
      "https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/",
      "https://blogs.microsoft.com/blog/2026/02/27/microsoft-and-openai-joint-statement-on-continuing-partnership/",
      "https://blogs.microsoft.com/blog/2026/02/24/microsoft-sovereign-cloud-adds-governance-productivity-and-support-for-large-ai-models-securely-running-even-when-completely-disconnected/",
      "https://blogs.microsoft.com/blog/2026/02/20/asha-sharma-named-evp-and-ceo-microsoft-gaming/",
      "https://blogs.microsoft.com/blog/2026/02/18/a-milestone-achievement-in-our-journey-to-carbon-negative/",
      "https://blogs.microsoft.com/blog/2026/02/04/updates-in-two-of-our-core-priorities/",
      "https://blogs.microsoft.com/blog/2026/01/27/how-microsoft-is-empowering-frontier-transformation-with-intelligence-trust/",
      "https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/",
      "https://blogs.microsoft.com/blog/2026/01/13/announcing-open-to-work-how-to-get-ahead-in-the-age-of-ai/",
      "https://blogs.microsoft.com/blog/2026/01/05/microsoft-announces-acquisition-of-osmos-to-accelerate-autonomous-data-engineering-in-fabric/",
      "https://blogs.microsoft.com/blog/2025/11/18/from-idea-to-deployment-the-complete-lifecycle-of-ai-on-display-at-ignite-2025/"
    ],
    blocks: [],
    sections: [
      {
        id: "section-1",
        name: "Article Content",
        selector: "article",
        style: null,
        blocks: [],
        defaultContent: [
          "h1.entry-title",
          ".entry-content > p",
          ".entry-content > h3"
        ]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_ms_blog_article_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let path = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!path) path = "/index";
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_ms_blog_article_exports);
})();
