/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ms-blog sections.
 * Adds section breaks (<hr>) between content sections.
 * Template has 3 sections (all with null style, so no Section Metadata blocks needed).
 * Runs in afterTransform only. Processes sections in reverse order.
 * Selectors from page-templates.json / captured DOM.
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process in reverse order to avoid position shifts
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      // Find the first element matching this section's selector
      const selectorList = Array.isArray(section.selector)
        ? section.selector
        : [section.selector];

      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(
          element.ownerDocument,
          { name: 'Section Metadata', cells: { style: section.style } },
        );
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before each section except the first
      const isFirst = sections.indexOf(section) === 0;
      if (!isFirst) {
        const hr = element.ownerDocument.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
