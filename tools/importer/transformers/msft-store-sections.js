/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Microsoft Store configurator page sections.
 * Adds section breaks and section-metadata from template sections.
 * Runs in afterTransform only. Selectors from captured DOM.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Find the section element using selector(s)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add section break (<hr>) before non-first sections if there's content before
      if (section.id !== 'section-1') {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
