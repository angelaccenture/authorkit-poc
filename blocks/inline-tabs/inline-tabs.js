/**
 * Inline Tabs block — in-page navigation pills.
 * Reads a list of anchor links and renders them as a horizontal
 * scrollable pill bar that smooth-scrolls to the target section.
 *
 * Content structure (authored as a list):
 *   <ul>
 *     <li><a href="#section-id">Label</a></li>
 *     ...
 *   </ul>
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const list = block.querySelector('ul');
  if (!list) return;

  const items = [...list.querySelectorAll('li')];

  const nav = document.createElement('nav');
  nav.className = 'inline-tabs-nav';
  nav.setAttribute('aria-label', 'In-page navigation');

  const bar = document.createElement('div');
  bar.className = 'inline-tabs-bar';

  items.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    const pill = document.createElement('a');
    pill.className = 'inline-tabs-pill';
    pill.href = link.href;
    pill.textContent = link.textContent;

    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      bar.querySelectorAll('.inline-tabs-pill').forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
    });

    bar.append(pill);
  });

  nav.append(bar);
  block.textContent = '';
  block.append(nav);
}
