/**
 * Card Carousel block — horizontal scrolling card grid with nav arrows.
 *
 * Content structure (each row = one card):
 *   Row: image-col | text-col (h3, p, link)
 *
 * Responsive behavior:
 *   Mobile (<600px): 1 card visible, scroll
 *   Tablet (600-899px): 2 cards visible
 *   Desktop (≥900px): 3 cards visible (no scroll if ≤3 cards)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'card-carousel-wrapper';

  // Build card track
  const track = document.createElement('div');
  track.className = 'card-carousel-track';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'card-carousel-card';

    const cols = [...row.children];
    const imageCol = cols[0];
    const textCol = cols[1];

    // Image
    if (imageCol) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'card-carousel-image';
      const pic = imageCol.querySelector('picture') || imageCol.querySelector('img');
      if (pic) imageWrap.append(pic);
      card.append(imageWrap);
    }

    // Text content
    if (textCol) {
      const content = document.createElement('div');
      content.className = 'card-carousel-content';

      const heading = textCol.querySelector('h2, h3, h4, h5');
      if (heading) content.append(heading);

      const desc = textCol.querySelector('p:not(:has(a:only-child))');
      if (desc) content.append(desc);

      const linkP = textCol.querySelector('p:has(a:only-child)');
      if (linkP) {
        const link = linkP.querySelector('a');
        if (link) {
          link.className = 'card-carousel-link';
          content.append(link);
        }
      }

      card.append(content);
    }

    track.append(card);
  });

  wrapper.append(track);

  // Navigation arrows
  const nav = document.createElement('div');
  nav.className = 'card-carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'card-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.disabled = true;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'card-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');

  nav.append(prevBtn, nextBtn);
  wrapper.append(nav);

  // Scroll behavior
  function updateButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = track;
    prevBtn.disabled = scrollLeft <= 0;
    nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
  }

  function scrollByCard(direction) {
    const card = track.querySelector('.card-carousel-card');
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(track).gap, 10) || 0;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));
  track.addEventListener('scroll', updateButtons);

  // Initial button state after layout
  requestAnimationFrame(updateButtons);

  block.textContent = '';
  block.append(wrapper);
}
