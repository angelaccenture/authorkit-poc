export default function init(el) {
  const inner = el.querySelector(':scope > div');
  inner.classList.add('teaser-inner');

  const pic = el.querySelector('picture');
  if (pic) {
    const picPara = pic.closest('div');
    if (picPara) {
        picPara.classList.add('teaser-picture-container');
        const con = el.querySelector(':scope > div:not([class]) > div');
        if (!con) return;
        con.classList.add('teaser-content-container');
        picPara.after(con);
    }
  }
  // Decorate CTA
  const ctaPara = inner.querySelector(':scope > div:last-of-type > p:last-of-type');
  if (!ctaPara) return;
  const cta = ctaPara.querySelector('a');
  if (!cta) return;
  const hashAware = el.classList.contains('hash-aware');
  if (hashAware) {
    cta.href = `${cta.getAttribute('href')}${window.location.hash}`;
  }
  ctaPara.classList.add('teaser-cta-container');
  inner.append(ctaPara);
}
