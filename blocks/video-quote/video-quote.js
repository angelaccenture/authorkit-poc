export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'video-quote-wrapper';

  // Row 1: Quote text + author
  const quoteRow = rows[0];
  if (quoteRow) {
    const quoteSection = document.createElement('div');
    quoteSection.className = 'video-quote-text';

    const quoteContent = quoteRow.querySelector('div');
    if (quoteContent) {
      // Extract blockquote or paragraphs
      const paragraphs = [...quoteContent.querySelectorAll('p')];
      paragraphs.forEach((p) => {
        quoteSection.append(p);
      });

      // Extract list of product links
      const list = quoteContent.querySelector('ul');
      if (list) {
        list.className = 'video-quote-products';
        quoteSection.append(list);
      }
    }
    wrapper.append(quoteSection);
  }

  // Row 2: Video embed or thumbnail
  const videoRow = rows[1];
  if (videoRow) {
    const videoSection = document.createElement('div');
    videoSection.className = 'video-quote-media';

    const pic = videoRow.querySelector('picture');
    const img = videoRow.querySelector('img');
    const link = videoRow.querySelector('a');

    if (pic) {
      videoSection.append(pic);
    } else if (img) {
      videoSection.append(img);
    }

    if (link) {
      const playBtn = document.createElement('button');
      playBtn.className = 'video-quote-play';
      playBtn.setAttribute('aria-label', 'Play video');
      playBtn.dataset.href = link.href;
      videoSection.append(playBtn);
    }

    wrapper.append(videoSection);
  }

  block.textContent = '';
  block.append(wrapper);
}
