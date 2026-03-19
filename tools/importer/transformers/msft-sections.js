/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: msft sections.
 * Adds section breaks (<hr>) and Section Metadata blocks for the msft-homepage template.
 * Template has 10 sections; 4 have styles (announcement-bar, dark, light-grey x2).
 *
 * Uses a two-pass approach:
 * - beforeTransform: Marks section boundaries with data attributes (before parsers modify DOM)
 * - afterTransform: Inserts <hr> and Section Metadata using the markers
 *
 * This two-pass approach is needed because parsers replace original DOM elements,
 * which can break :has() and descendant selectors used to identify sections.
 */
export default function transform(hookName, element, payload) {
  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const document = element.ownerDocument;

  if (hookName === 'beforeTransform') {
    // Mark section boundaries before parsers modify the DOM
    sections.forEach((section) => {
      const selectorList = Array.isArray(section.selector)
        ? section.selector
        : [section.selector];

      for (const sel of selectorList) {
        try {
          const el = element.querySelector(sel);
          if (el) {
            el.setAttribute('data-section-id', section.id);
            if (section.style) {
              el.setAttribute('data-section-style', section.style);
            }
            break;
          }
        } catch (e) {
          // Invalid selector, skip
        }
      }
    });
  }

  if (hookName === 'afterTransform') {
    // Find all marked section boundaries and insert <hr> + Section Metadata
    const markedSections = Array.from(
      element.querySelectorAll('[data-section-id]')
    );

    // Process in reverse to avoid position shifts
    markedSections.reverse().forEach((sectionEl) => {
      const sectionId = sectionEl.getAttribute('data-section-id');
      const style = sectionEl.getAttribute('data-section-style');

      // Clean up marker attributes
      sectionEl.removeAttribute('data-section-id');
      sectionEl.removeAttribute('data-section-style');

      // Add Section Metadata block if section has a style
      if (style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(
          document,
          { name: 'Section Metadata', cells: { style } },
        );
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before each section except the first
      const isFirst = sectionId === sections[0].id;
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
