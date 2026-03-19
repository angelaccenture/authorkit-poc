export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (rows.length < 1) return;

  // The block has two columns: image | text content
  const firstRow = rows[0];
  const cols = [...firstRow.querySelectorAll(':scope > div')];

  if (cols.length >= 2) {
    // Two-column layout: image on left, text on right
    cols[0].classList.add('hero-carousel-slide-image');
    cols[1].classList.add('hero-carousel-slide-content');
  } else if (cols.length === 1) {
    // Single column: check if it has a picture
    const pic = cols[0].querySelector('picture');
    if (pic) {
      cols[0].classList.add('hero-carousel-slide-image');
      if (rows.length > 1) {
        rows[1].classList.add('hero-carousel-slide-content');
      }
    } else {
      cols[0].classList.add('hero-carousel-slide-content');
    }
  }

  // Decorate CTA links
  el.querySelectorAll('.hero-carousel-slide-content a').forEach((a) => {
    const p = a.closest('p');
    if (p && p.children.length === 1) {
      p.classList.add('hero-carousel-slide-cta');
    }
  });

  // Decorate headings
  el.querySelectorAll('.hero-carousel-slide-content h1, .hero-carousel-slide-content h2').forEach((h) => {
    h.classList.add('hero-carousel-slide-heading');
  });
}
