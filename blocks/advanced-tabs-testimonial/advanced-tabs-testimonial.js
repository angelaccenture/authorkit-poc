export default function init(el) {
  const rows = [...el.children];
  if (!rows.length) return;

  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.role = 'tablist';

  const panels = [];

  rows.forEach((row, idx) => {
    // Each row: image | name + role + quote
    const cols = [...row.children];
    const imgCol = cols[0];
    const textCol = cols[1];

    // Extract name from first <strong>
    const nameEl = textCol?.querySelector('strong');
    const name = nameEl ? nameEl.textContent.trim() : `Tab ${idx + 1}`;

    // Create tab button
    const btn = document.createElement('button');
    btn.role = 'tab';
    btn.id = `tab-${idx + 1}`;
    btn.textContent = name;
    if (idx === 0) btn.classList.add('is-active');
    tabList.append(btn);

    // Create panel
    const panel = document.createElement('div');
    panel.className = 'testimonial-panel';
    panel.role = 'tabpanel';
    panel.id = `tabpanel-${idx + 1}`;
    panel.setAttribute('aria-labelledby', `tab-${idx + 1}`);
    if (idx === 0) panel.classList.add('is-visible');

    if (imgCol) panel.append(imgCol);
    if (textCol) panel.append(textCol);
    panels.push(panel);

    // Wire click
    btn.addEventListener('click', () => {
      tabList.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-visible'));
      btn.classList.add('is-active');
      panel.classList.add('is-visible');
    });
  });

  el.textContent = '';
  el.append(tabList, ...panels);
}
