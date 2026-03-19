export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const nav = document.createElement('nav');
  nav.className = 'quick-links-nav';
  nav.setAttribute('aria-label', 'Product categories');

  const list = document.createElement('ul');
  list.className = 'quick-links-list';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length < 2) return;

    const iconCol = cols[0];
    const linkCol = cols[1];

    const li = document.createElement('li');
    li.className = 'quick-links-item';

    // Icon
    const iconWrap = document.createElement('div');
    iconWrap.className = 'quick-links-icon';
    const pic = iconCol.querySelector('picture');
    if (pic) {
      iconWrap.append(pic);
    }

    // Link
    const linkWrap = document.createElement('div');
    linkWrap.className = 'quick-links-label';
    const link = linkCol.querySelector('a');
    if (link) {
      linkWrap.append(link);
    } else {
      linkWrap.textContent = linkCol.textContent.trim();
    }

    li.append(iconWrap, linkWrap);
    list.append(li);
  });

  nav.append(list);
  el.textContent = '';
  el.append(nav);
}
