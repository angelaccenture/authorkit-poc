export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const nav = document.createElement('nav');
  nav.className = 'quick-links-nav';
  nav.setAttribute('aria-label', 'Product categories');

  const list = document.createElement('ul');
  list.className = 'quick-links-list';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length === 0) return;

    const li = document.createElement('li');
    li.className = 'quick-links-item';

    // Two columns: icon + link; one column: link only
    const linkCol = cols.length >= 2 ? cols[1] : cols[0];
    const iconCol = cols.length >= 2 ? cols[0] : null;

    if (iconCol) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'quick-links-icon';
      const pic = iconCol.querySelector('picture');
      if (pic) iconWrap.append(pic);
      li.append(iconWrap);
    }

    const linkWrap = document.createElement('div');
    linkWrap.className = 'quick-links-label';
    const link = linkCol.querySelector('a');
    if (link) {
      linkWrap.append(link);
    } else {
      linkWrap.textContent = linkCol.textContent.trim();
    }

    li.append(linkWrap);
    list.append(li);
  });

  nav.append(list);
  el.textContent = '';
  el.append(nav);
}
