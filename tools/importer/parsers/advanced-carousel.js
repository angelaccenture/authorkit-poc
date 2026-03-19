/* eslint-disable */
/* global WebImporter */

/**
 * Parser for advanced-carousel. Comprehensive parser that also extracts slide content.
 * Source: https://www.microsoft.com/en-us
 * Generated: 2026-03-18
 *
 * The advanced-carousel is a section-level wrapper. In EDS, it expects:
 * 1. A section with the advanced-carousel block containing a <ul> of slide labels
 * 2. Followed by sibling sections (one per slide) separated by <hr>
 *
 * This parser handles both the carousel block AND the slide content blocks,
 * because the slide elements are children of the carousel container.
 * Processing them separately would fail since replacing the parent destroys child context.
 *
 * Detects two slide types:
 * - Hero slides: reimagine-hero-featured-slider-item (used in hero carousel)
 * - Banner slides: reimagine-card-banner inside reimagine-carousel-item (used in bottom carousel)
 */
export default function parse(element, { document }) {
  // Detect slide type by checking what's inside the carousel
  const heroSlides = Array.from(
    element.querySelectorAll('reimagine-hero-featured-slider-item')
  );
  const bannerItems = Array.from(
    element.querySelectorAll('reimagine-carousel-item')
  );

  const slides = heroSlides.length > 0 ? heroSlides : bannerItems;
  const slideType = heroSlides.length > 0 ? 'hero-carousel-slide' : 'banner-carousel-slide';

  // Build slide labels for the <ul>
  const ul = document.createElement('ul');
  slides.forEach((slide, idx) => {
    const li = document.createElement('li');
    // Try to extract heading text for the label
    const heading = slide.querySelector('h1, h2');
    const headingText = heading ? heading.textContent.replace(/\s+/g, ' ').trim() : `Slide ${idx + 1}`;
    li.textContent = headingText;
    ul.appendChild(li);
  });

  // Create the advanced-carousel block with <ul>
  const carouselBlock = WebImporter.Blocks.createBlock(document, {
    name: 'advanced-carousel',
    cells: [[ul]],
  });

  // Build slide blocks
  const slideBlocks = [];
  slides.forEach((slide) => {
    let slideBlock;

    if (slideType === 'hero-carousel-slide') {
      slideBlock = buildHeroSlide(slide, document);
    } else {
      slideBlock = buildBannerSlide(slide, document);
    }

    if (slideBlock) {
      slideBlocks.push(slideBlock);
    }
  });

  // Replace the carousel element with: carousel block, then <hr> + slide blocks
  const fragment = document.createDocumentFragment();
  fragment.appendChild(carouselBlock);

  slideBlocks.forEach((slideBlock) => {
    const hr = document.createElement('hr');
    fragment.appendChild(hr);
    fragment.appendChild(slideBlock);
  });

  element.replaceWith(fragment);
}

/**
 * Build a hero-carousel-slide block from a reimagine-hero-featured-slider-item.
 * Layout: 2-column [image | heading + description + CTA]
 */
function buildHeroSlide(slide, document) {
  // Image - try multiple patterns
  const picture = slide.querySelector('picture');
  const img = picture || slide.querySelector('img');

  // Heading
  const heading = slide.querySelector('h1, h2');

  // Description - try content-text slot, then paragraphs
  const descDiv = slide.querySelector('div[slot="heading-block__content-text"]');
  let descText = '';
  if (descDiv) {
    descText = descDiv.textContent.replace(/\s+/g, ' ').trim();
  }

  // CTA links
  const ctaLinks = Array.from(slide.querySelectorAll('a[href]'));

  // Build cells: 2-column [image | text]
  const imageCell = [];
  if (img) imageCell.push(img);

  const textCell = [];
  if (heading) textCell.push(heading);
  if (descText) {
    const p = document.createElement('p');
    p.textContent = descText;
    textCell.push(p);
  }
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    a.textContent = link.textContent.replace(/\s+/g, ' ').trim();
    p.appendChild(a);
    textCell.push(p);
  });

  const cells = [];
  if (imageCell.length > 0 || textCell.length > 0) {
    cells.push([imageCell, textCell]);
  }

  return WebImporter.Blocks.createBlock(document, { name: 'hero-carousel-slide', cells });
}

/**
 * Build a banner-carousel-slide block from a reimagine-carousel-item.
 * Layout: 1-column [image row, text row]
 */
function buildBannerSlide(item, document) {
  const banner = item.querySelector('reimagine-card-banner') || item;

  // Image
  const picture = banner.querySelector('picture');
  const img = picture || banner.querySelector('img');

  // Heading
  const heading = banner.querySelector('h2, h1');

  // Description
  const descEl = banner.querySelector('p[slot="text-block__content"]')
    || banner.querySelector('reimagine-text-block p');
  const descDiv = banner.querySelector('div[slot="heading-block__content-text"]');
  const descText = descEl
    ? descEl.textContent.replace(/\s+/g, ' ').trim()
    : (descDiv ? descDiv.textContent.replace(/\s+/g, ' ').trim() : '');

  // CTA
  const ctaLinks = Array.from(banner.querySelectorAll('a[href]'));

  const cells = [];

  // Row 1: Image
  if (img) {
    cells.push([img]);
  }

  // Row 2: Text content
  const textCell = [];
  if (heading) textCell.push(heading);
  if (descText) {
    const p = document.createElement('p');
    p.textContent = descText;
    textCell.push(p);
  }
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    a.textContent = link.textContent.replace(/\s+/g, ' ').trim();
    p.appendChild(a);
    textCell.push(p);
  });

  if (textCell.length > 0) {
    cells.push([textCell]);
  }

  return WebImporter.Blocks.createBlock(document, { name: 'banner-carousel-slide', cells });
}
