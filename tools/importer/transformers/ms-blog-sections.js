/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer: Microsoft Blog.
 * Adds <hr> section breaks between sections from template.
 * Runs in afterTransform only.
 * Both sections have null style, so no Section Metadata blocks are created.
 * Section selectors from page-templates.json sections[].selector.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const sections = payload?.template?.sections;
    if (!sections || sections.length < 2) return;

    const doc = element.ownerDocument || document;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before non-first sections
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
