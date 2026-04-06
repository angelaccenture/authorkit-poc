export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'video-quote-wrapper';

  // Row 1: Quote text + author + product links
  const quoteRow = rows[0];
  if (quoteRow) {
    const quoteSection = document.createElement('div');
    quoteSection.className = 'video-quote-text';

    const quoteContent = quoteRow.querySelector('div');
    if (quoteContent) {
      // Move all children (h2, p, ul, etc.) into the quote section
      while (quoteContent.firstChild) {
        quoteSection.append(quoteContent.firstChild);
      }
    }
    wrapper.append(quoteSection);
  }

  // Row 2: Video thumbnail
  const videoRow = rows[1];
  if (videoRow) {
    const videoSection = document.createElement('div');
    videoSection.className = 'video-quote-media';

    const pic = videoRow.querySelector('picture');
    const img = videoRow.querySelector('img');

    if (pic) {
      videoSection.append(pic);
    } else if (img) {
      videoSection.append(img);
    }

    // Add play button overlay
    const playBtn = document.createElement('button');
    playBtn.className = 'video-quote-play';
    playBtn.setAttribute('aria-label', 'Play video');
    videoSection.append(playBtn);

    wrapper.append(videoSection);
  }

  block.textContent = '';
  block.append(wrapper);
}
