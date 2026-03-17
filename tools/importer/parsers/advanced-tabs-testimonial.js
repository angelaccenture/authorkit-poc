/* eslint-disable */
/* global WebImporter */

/**
 * Parser for advanced-tabs-testimonial variant.
 * Base block: advanced-tabs
 * Source: https://wknd-trendsetters.site
 * Source selector: .tabs-wrapper
 * Extracts: 4 tab panels with image + name + role + quote
 * Target: Block table with one row per tab (image | name + role + quote)
 */
export default function parse(element, { document }) {
  // Extract tab pane content from captured DOM: <div class="tab-pane">
  const tabPanes = Array.from(element.querySelectorAll('.tab-pane'));

  const cells = [];

  tabPanes.forEach((pane) => {
    // Image from captured DOM: <img class="cover-image"> inside grid-layout
    const img = pane.querySelector('img.cover-image, img');

    // Build text content cell
    const contentCell = [];

    // Name from captured DOM: <div class="paragraph-xl utility-margin-bottom-0"><strong>Name</strong></div>
    const nameStrong = pane.querySelector('.paragraph-xl strong, strong');
    if (nameStrong) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameStrong.textContent.trim();
      nameP.append(strong);
      contentCell.push(nameP);
    }

    // Role from captured DOM: sibling <div> after the name container
    const nameContainer = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameContainer && nameContainer.parentElement) {
      const roleEl = nameContainer.parentElement.querySelector(':scope > div:not(.paragraph-xl)');
      if (roleEl && roleEl.textContent.trim()) {
        const roleP = document.createElement('p');
        roleP.textContent = roleEl.textContent.trim();
        contentCell.push(roleP);
      }
    }

    // Quote from captured DOM: <p class="paragraph-xl"> (testimonial text)
    const quoteEl = pane.querySelector('p.paragraph-xl');
    if (quoteEl) {
      const quoteP = document.createElement('p');
      quoteP.textContent = quoteEl.textContent.trim();
      contentCell.push(quoteP);
    }

    // Row: image | text content (name + role + quote)
    cells.push([img || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'advanced-tabs-testimonial', cells });
  element.replaceWith(block);
}
