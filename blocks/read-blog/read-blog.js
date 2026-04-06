/**
 * Read Blog block — featured blog post + recent articles sidebar.
 *
 * Content structure:
 *   Row 1: "More blogs" link
 *   Row 2: Featured post — image | meta, h5 heading, description, link
 *   Row 3+: Recent articles — image | meta, h5 heading, link
 *
 * Layout: Featured post large on left, recent articles stacked on right (desktop).
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'read-blog-wrapper';

  // First row: header with title link ("More blogs")
  const headerRow = rows[0];
  const headerLink = headerRow?.querySelector('a');

  // Find the featured post (first row with an image)
  // Find recent articles heading (h4 "Recent articles")
  const featuredContent = [];
  const recentContent = [];
  let isRecent = false;

  rows.forEach((row) => {
    const h4 = row.querySelector('h4');
    if (h4 && h4.textContent.includes('Recent')) {
      isRecent = true;
      return;
    }
    if (isRecent) {
      recentContent.push(row);
    } else {
      featuredContent.push(row);
    }
  });

  // Build featured post
  const featured = document.createElement('div');
  featured.className = 'read-blog-featured';

  featuredContent.forEach((row) => {
    const img = row.querySelector('img');

    if (img && !featured.querySelector('img')) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'read-blog-featured-image';
      const pic = img.closest('picture') || img;
      imageWrap.append(pic);
      featured.append(imageWrap);
    }

    // Move all content children
    while (row.firstChild) {
      featured.append(row.firstChild);
    }
  });

  wrapper.append(featured);

  // Build recent articles
  if (recentContent.length) {
    const recent = document.createElement('div');
    recent.className = 'read-blog-recent';

    const recentHeading = document.createElement('h4');
    recentHeading.textContent = 'Recent articles';
    recent.append(recentHeading);

    recentContent.forEach((row) => {
      const article = document.createElement('div');
      article.className = 'read-blog-article';
      while (row.firstChild) {
        article.append(row.firstChild);
      }
      recent.append(article);
    });

    wrapper.append(recent);
  }

  // Add header link if exists
  if (headerLink) {
    const moreLink = document.createElement('div');
    moreLink.className = 'read-blog-more';
    moreLink.append(headerLink);
    wrapper.prepend(moreLink);
  }

  block.textContent = '';
  block.append(wrapper);
}
