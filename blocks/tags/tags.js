import { getMetadata } from '../../scripts/ak.js';

function filter(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/\s/gm, '-') // replace whitespace with -
    .replace(/&amp;/gm, '') // remove encoded ampersands
    .replace(/&/gm, '') // remove unencoded ampersands
    .replace(/\./gm, '') // remove dots
    .replace(/--+/g, '-'); // remove multiple dashes
}


export default function init(el) {
  console.log(el);
  const tagMeta = getMetadata('article:tag');
  console.log(tagMeta);
  const tagRoot = el.querySelector(':scope > div');
   // tagAll.forEach(tagelement => {
   //     btnelement.remove();
   // });
      const tag = document.createElement('a');
      tag.textContent = tagMeta;
      const name = tagMeta;
      console.log(tag);
      const root = "https://blogs.microsoft.com/blog/tag/"
      tag.href = root + `${filter(name)}`;
      tag.setAttribute('aria-label',tagMeta);
      tagRoot.before(tag);
}
