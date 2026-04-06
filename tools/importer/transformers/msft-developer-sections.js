/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: msft-developer sections.
 * Adds section breaks (<hr>) between content sections.
 * Runs in afterTransform only. Uses payload.template.sections.
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      const selectorList = Array.isArray(section.selector)
        ? section.selector
        : [section.selector];

      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(
          element.ownerDocument,
          { name: 'Section Metadata', cells: { style: section.style } },
        );
        sectionEl.after(sectionMetadata);
      }

      const isFirst = sections.indexOf(section) === 0;
      if (!isFirst) {
        const hr = element.ownerDocument.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
