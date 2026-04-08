/**
 * Product Gallery block — thumbnail strip + main image + product details.
 *
 * Authoring (two-column rows):
 *   Row 1: Image | Product details (heading, price, links, CTA)
 *   Row 2: Image |
 *   Row 3: Image |
 *   ...
 *
 * The first row's second column holds the product info panel.
 * All rows' first columns are gallery images.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const images = [];
  let detailsContent = null;

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const imgCol = cols[0];
    const textCol = cols[1];

    const img = imgCol?.querySelector('img');
    if (img) images.push({ src: img.src, alt: img.alt || '' });

    // First row's second column is the product details
    if (i === 0 && textCol && textCol.textContent.trim()) {
      detailsContent = textCol;
    }
  });

  if (!images.length) return;

  block.textContent = '';

  // Thumbnails
  const thumbStrip = document.createElement('div');
  thumbStrip.className = 'product-gallery-thumbs';

  // Main image
  const mainContainer = document.createElement('div');
  mainContainer.className = 'product-gallery-main';
  const mainImg = document.createElement('img');
  mainImg.src = images[0].src;
  mainImg.alt = images[0].alt;
  mainImg.loading = 'eager';
  mainContainer.append(mainImg);

  images.forEach((image, i) => {
    const thumb = document.createElement('button');
    thumb.className = 'product-gallery-thumb';
    if (i === 0) thumb.classList.add('active');
    thumb.setAttribute('aria-label', image.alt || `View image ${i + 1}`);

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = i === 0 ? 'eager' : 'lazy';
    thumb.append(img);

    thumb.addEventListener('click', () => {
      mainImg.src = image.src;
      mainImg.alt = image.alt;
      thumbStrip.querySelector('.active')?.classList.remove('active');
      thumb.classList.add('active');
    });

    thumbStrip.append(thumb);
  });

  block.append(thumbStrip, mainContainer);

  // Product details panel (right column)
  if (detailsContent) {
    const details = document.createElement('div');
    details.className = 'product-gallery-details';
    while (detailsContent.firstChild) details.append(detailsContent.firstChild);
    block.append(details);
  }
}
