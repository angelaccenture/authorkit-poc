/* eslint-disable */
/* global WebImporter */

/**
 * Parser for ai-chat. Base: custom.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * Extracts the AI assistant chat component with heading, text input, and suggestion pills.
 *
 * Source DOM (from captured HTML):
 * - Container: div.msstore-chatonpage.contained
 *   - Heading: div.msstore-chatonpage__heading-container h2
 *   - Input: input.msstore-chatonpage__text-input[placeholder]
 *   - Suggestion pills: div.msstore-chatonpage__pills-container button.msstore-chatonpage__prompt-pill[data-pill-value]
 *
 * Block structure: 1-column table
 *   Row 1: heading (h2)
 *   Row 2: input placeholder text
 *   Row 3: suggestion button texts (comma-separated or as list)
 */
export default function parse(element, { document }) {
  // Heading
  const heading = element.querySelector('.msstore-chatonpage__heading-container h2, h2');

  // Input placeholder text
  const input = element.querySelector('input.msstore-chatonpage__text-input, input[type="text"]');
  const placeholderText = input ? input.getAttribute('placeholder') || '' : '';

  // Suggestion pill buttons
  const pills = Array.from(
    element.querySelectorAll('button.msstore-chatonpage__prompt-pill')
  );

  const cells = [];

  // Row 1: Heading
  if (heading) {
    cells.push([heading]);
  }

  // Row 2: Input placeholder text
  if (placeholderText) {
    const p = document.createElement('p');
    p.textContent = placeholderText;
    cells.push([p]);
  }

  // Row 3: Suggestion texts as a list
  if (pills.length > 0) {
    const ul = document.createElement('ul');
    pills.forEach((pill) => {
      const li = document.createElement('li');
      li.textContent = pill.getAttribute('data-pill-value') || pill.textContent.trim();
      ul.appendChild(li);
    });
    cells.push([ul]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'ai-chat', cells });
  element.replaceWith(block);
}
