export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (rows.length < 2) return;

  // Row structure: background image row, then text content row
  const bgRow = rows[0];
  const contentRow = rows[1];

  bgRow.classList.add('banner-carousel-slide-image');
  contentRow.classList.add('banner-carousel-slide-content');

  // Ensure image is positioned as background
  const pic = bgRow.querySelector('picture');
  if (pic) {
    const img = pic.querySelector('img');
    if (img) {
      img.loading = 'eager';
    }
  }

  // Decorate CTA links
  contentRow.querySelectorAll('a').forEach((a) => {
    const p = a.closest('p');
    if (p && p.children.length === 1) {
      p.classList.add('banner-carousel-slide-cta');
    }
  });

  // Decorate headings
  contentRow.querySelectorAll('h1, h2, h3').forEach((h) => {
    h.classList.add('banner-carousel-slide-heading');
  });
}
