export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'social-follow-container';

  const linksList = document.createElement('div');
  linksList.className = 'social-follow-links';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    // Check if this row has a heading
    const heading = row.querySelector('h1, h2, h3');
    if (heading) {
      heading.classList.add('social-follow-heading');
      container.append(heading);
      return;
    }

    if (cols.length >= 2) {
      const iconCol = cols[0];
      const linkCol = cols[1];

      const linkItem = document.createElement('a');
      const link = linkCol.querySelector('a');
      if (link) {
        linkItem.href = link.href;
        linkItem.setAttribute('aria-label', link.textContent.trim());
      }
      linkItem.className = 'social-follow-link';
      linkItem.target = '_blank';
      linkItem.rel = 'noopener noreferrer';

      const pic = iconCol.querySelector('picture') || iconCol.querySelector('img');
      if (pic) {
        linkItem.append(pic);
      }

      linksList.append(linkItem);
    }
  });

  container.append(linksList);
  el.textContent = '';
  el.append(container);
}
