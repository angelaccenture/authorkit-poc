/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq variant.
 * Base block: accordion
 * Source: https://wknd-trendsetters.site
 * Source selector: .faq-list
 * Extracts: 4 expandable Q&A items (details/summary pattern)
 * Target: Accordion block table (N rows, 2 columns: question | answer)
 */
export default function parse(element, { document }) {
  // Extract FAQ items from captured DOM: <details class="faq-item">
  const faqItems = Array.from(element.querySelectorAll('details.faq-item, details'));

  const cells = [];
  faqItems.forEach((item) => {
    // Question from captured DOM: <summary class="faq-question"> <span>question text</span>
    const summary = item.querySelector('summary.faq-question, summary');
    const questionSpan = summary ? summary.querySelector('span') : null;
    const questionText = questionSpan
      ? questionSpan.textContent.trim()
      : (summary ? summary.textContent.trim() : '');

    // Answer from captured DOM: <div class="faq-answer"> containing <p> elements
    const answerDiv = item.querySelector('.faq-answer, div:not(summary)');
    const answerParagraphs = answerDiv
      ? Array.from(answerDiv.querySelectorAll('p'))
      : [];

    // Build answer cell: preserve paragraph elements
    const answerCell = [];
    if (answerParagraphs.length > 0) {
      answerParagraphs.forEach((p) => answerCell.push(p));
    } else if (answerDiv) {
      const p = document.createElement('p');
      p.textContent = answerDiv.textContent.trim();
      answerCell.push(p);
    }

    // Row: question | answer
    cells.push([questionText, answerCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
