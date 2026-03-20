/* eslint-disable */
/* global WebImporter */

/**
 * Parser for pricing-cards. NEW block.
 * Source: https://www.microsoft.com/en-us/microsoft-365
 * Generated: 2026-03-20
 *
 * Extracts pricing plan comparison cards from the Plans section.
 * Static simplification: uses yearly pricing tab only (first active tab panel).
 * 5 plans: Free, Basic, Personal, Family, Premium.
 *
 * Source DOM (from cleaned.html):
 * - Container: div.carousel.carousel--card-grid (inside first active tab-panel)
 *   - Each plan: div.carousel__slide > div.card-plan-detail (or nested in experiencefragment)
 *     - Plan name: h3.oc-product-title
 *     - Price: span.oc-displayListPrice
 *     - Billing unit: span.oc-displayUnit (e.g., "/year", "/month")
 *     - CTAs: div.sku__buttons a.btn
 *     - Feature heading: h4 > span (e.g., "Everything in Basic, plus:")
 *     - Feature list: ul.block-items-list > li (text in .list-item__content-title)
 *     - App badges: div.card-plan-detail__badges img (alt text = app name)
 *
 * Block structure: 1-column table (one row per plan)
 *   Each row: plan name, price + unit, CTAs, feature heading, feature list, app icons
 */
export default function parse(element, { document }) {
  // Only process the carousel inside the first (active/yearly) tab panel
  const tabPanel = element.closest('.tab-panel');
  if (tabPanel && !tabPanel.classList.contains('active')) {
    element.remove();
    return;
  }

  const carousel = element.querySelector('.carousel--card-grid .carousel')
    || element.querySelector('.carousel')
    || element;

  // Get all plan slides
  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));

  const cells = [];

  slides.forEach((slide) => {
    const planDetail = slide.querySelector('.card-plan-detail');
    if (!planDetail) return;

    const rowContent = [];

    // Plan name
    const planName = planDetail.querySelector('h3.oc-product-title');
    if (planName) {
      const h3 = document.createElement('h3');
      h3.textContent = planName.textContent.trim();
      rowContent.push(h3);
    }

    // Price + unit
    const price = planDetail.querySelector('span.oc-displayListPrice');
    const unit = planDetail.querySelector('span.oc-displayUnit');
    if (price) {
      let priceText = price.textContent.trim();
      if (unit) priceText += unit.textContent.trim();
      const pStrong = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = priceText;
      pStrong.appendChild(strong);
      rowContent.push(pStrong);
    }

    // CTA buttons (from sku__buttons, not template)
    const skuButtons = planDetail.querySelector('.sku__buttons');
    if (skuButtons) {
      const ctaLinks = Array.from(skuButtons.querySelectorAll('a.btn'));
      ctaLinks.forEach((link) => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href') || '';
        const btnText = link.querySelector('.btn__text');
        a.textContent = (btnText ? btnText.textContent : link.textContent).trim();
        p.appendChild(a);
        rowContent.push(p);
      });
    }

    // Feature heading (e.g., "Everything in Basic, plus:")
    const featureHeading = planDetail.querySelector('.block-feature__title h4');
    if (featureHeading) {
      const h4 = document.createElement('h4');
      h4.textContent = featureHeading.textContent.trim();
      rowContent.push(h4);
    }

    // Feature list
    const featureItems = Array.from(
      planDetail.querySelectorAll('.card-plan-detail__content .block-items-list > .block-items-list__item')
    );
    if (featureItems.length > 0) {
      const ul = document.createElement('ul');
      featureItems.forEach((item) => {
        const titleEl = item.querySelector('.list-item__content-title');
        if (titleEl) {
          // Clone and strip non-content elements including style tags
          const clone = titleEl.cloneNode(true);
          clone.querySelectorAll(
            '.popover__content, .popover__info, .popover__card, button, .ocr-icon-svg--info-filled, style, script, link'
          ).forEach((el) => el.remove());
          const text = clone.textContent.trim();
          if (text) {
            const li = document.createElement('li');
            li.textContent = text;
            ul.appendChild(li);
          }
        }
      });
      if (ul.children.length > 0) {
        rowContent.push(ul);
      }
    }

    // App badge icons
    const badges = Array.from(
      planDetail.querySelectorAll('.card-plan-detail__badges .popover__badge img')
    );
    if (badges.length > 0) {
      const badgeP = document.createElement('p');
      badges.forEach((badge, i) => {
        if (i > 0) badgeP.appendChild(document.createTextNode(' '));
        const span = document.createElement('span');
        span.textContent = badge.alt || badge.title || '';
        badgeP.appendChild(span);
      });
      rowContent.push(badgeP);
    }

    if (rowContent.length > 0) {
      cells.push([rowContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'pricing-cards', cells });
  element.replaceWith(block);
}
