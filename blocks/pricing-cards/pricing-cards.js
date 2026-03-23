export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    row.classList.add('pricing-card');
    const cell = row.querySelector(':scope > div');
    if (!cell) return;
    cell.classList.add('pricing-card-inner');

    // Plan name (h3)
    const h3 = cell.querySelector('h3');
    if (h3) h3.classList.add('pricing-plan-name');

    // Price (p > strong)
    const priceP = cell.querySelector('p > strong');
    if (priceP) priceP.closest('p').classList.add('pricing-price');

    // Feature heading (h4)
    const h4 = cell.querySelector('h4');
    if (h4) h4.classList.add('pricing-feature-heading');

    // Feature list (ul)
    const ul = cell.querySelector('ul');
    if (ul) ul.classList.add('pricing-features');

    // CTA buttons — p elements with a child <a> that come before ul
    const allP = [...cell.querySelectorAll(':scope > p')];
    const children = [...cell.children];
    const ulIndex = ul ? children.indexOf(ul) : children.length;
    allP.forEach((p) => {
      const link = p.querySelector('a');
      if (link && !p.classList.contains('pricing-price')) {
        const pIndex = children.indexOf(p);
        if (pIndex > ulIndex) {
          p.classList.add('pricing-badges');
        } else {
          p.classList.add('pricing-cta');
        }
      }
    });

    // Last p without a link after ul = app badges text
    const lastP = cell.querySelector(':scope > p:last-child');
    if (lastP && !lastP.querySelector('a') && ul) {
      lastP.classList.add('pricing-badges');
    }
  });
}
