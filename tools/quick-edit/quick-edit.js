import { loadPage } from '../../scripts/scripts.js';
import initStylePicker, { openStylePicker } from './style-picker.js';

const importMap = {
  imports: {
    'da-lit': 'https://da.live/deps/lit/dist/index.js',
    'da-y-wrapper': 'https://da.live/deps/da-y-wrapper/dist/index.js',
  },
};

function addImportmap() {
  const importmapEl = document.createElement('script');
  importmapEl.type = 'importmap';
  importmapEl.textContent = JSON.stringify(importMap);
  document.head.appendChild(importmapEl);
}

function applyCustomizations() {
  console.log("applyCustomizations");
  const style = document.createElement('style');
  style.textContent = `
    .prosemirror-floating-toolbar .toolbar-btn-underline {
      display: none !important;
    }
    .qe-selected {
      outline: 2px solid #0078d4 !important;
      outline-offset: 4px;
      border-radius: 4px;
    }
    .da-image-palettes {
      display: none;
      position: absolute;
      z-index: 100001;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px 0 rgb(0 0 0 / 10%);
      width: 280px;
      font-family: system-ui, sans-serif;
    }
    .da-image-palettes.open { display: flex; flex-direction: column; }
    .da-image-palettes .palette-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      margin: 0 0 16px;
      color: #000;
    }
    .da-image-palettes .palette-field {
      margin-bottom: 12px;
    }
    .da-image-palettes .palette-label {
      font-size: 13px;
      font-weight: 600;
      color: #000;
      display: block;
      margin-bottom: 4px;
    }
    .da-image-palettes .palette-input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      font-size: 14px;
      font-family: inherit;
    }
    .da-image-palettes .palette-input:focus {
      outline: none;
      border-color: #0078d4;
    }
    .da-image-palettes textarea.palette-input {
      resize: vertical;
      min-height: 60px;
    }
    .da-image-palettes .palette-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    .da-image-palettes .palette-actions button {
      padding: 8px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .da-image-palettes .palette-btn-cancel {
      border: 1px solid #ccc;
      background: #fff;
      color: #000;
    }
    .da-image-palettes .palette-btn-ok {
      border: 1px solid #0078d4;
      background: #0078d4;
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  // Image editor panel — mirrors da-palettes style
  // Appended lazily to avoid DA's quick-edit clearing it
  const altEditor = document.createElement('div');
  altEditor.className = 'da-image-palettes';
  altEditor.innerHTML = `
    <span class="palette-title">Edit Image</span>
    <div class="palette-field">
      <span class="palette-label">Alt text</span>
      <textarea id="qe-alt-input" class="palette-input" placeholder="Describe this image..."></textarea>
    </div>
    <div class="palette-actions">
      <button class="palette-btn-cancel">Cancel</button>
      <button class="palette-btn-ok">OK</button>
    </div>
  `;

  function ensureAltEditorInDOM() {
    if (!document.body.contains(altEditor)) {
      document.body.appendChild(altEditor);
    }
  }

  let altTarget = null;
  let lastSelectedImage = null;

  altEditor.querySelector('.palette-btn-cancel').addEventListener('click', () => {
      console.log("applyCustomizations - click event cancel");
    altEditor.classList.remove('open');
    altTarget = null;
  });

  // Get DA config from the page
  function getDAConfig() {
    let { hostname } = window.location;
    if (hostname === 'localhost') {
      const meta = document.querySelector('meta[property="hlx:proxyUrl"]');
      if (meta) hostname = meta.content;
    }
    const parts = hostname.split('.')[0].split('--');
    const [, repo, owner] = parts;
    const path = window.location.pathname;
    return { owner, repo, path };
  }

  // Save alt text change to DA by fetching source, updating, and PUTting back
  async function saveAltToDA(imgEl, newAlt) {
    const { owner, repo, path } = getDAConfig();
    const pagePath = path === '/' ? '/index' : path;
    const sourceUrl = `https://admin.da.live/source/${owner}/${repo}${pagePath}.html`;

    try {
      // Fetch current source HTML from DA
      const getResp = await fetch(sourceUrl, { credentials: 'include' });
      if (!getResp.ok) {
        console.error('Failed to fetch DA source:', getResp.status);
        return;
      }
      const sourceHtml = await getResp.text();

      // Parse it and find the matching image
      const parser = new DOMParser();
      const doc = parser.parseFromString(sourceHtml, 'text/html');

      // Match by src — find the img with the same source
      const imgSrc = imgEl.getAttribute('src') || '';
      const srcPart = imgSrc.split('/').pop().split('?')[0]; // get filename

      let updated = false;
      doc.querySelectorAll('img').forEach((img) => {
        const thisSrc = img.getAttribute('src') || '';
        if (thisSrc.includes(srcPart)) {
          img.setAttribute('alt', newAlt);
          updated = true;
        }
      });

      if (!updated) {
        console.warn('Could not find matching image in DA source');
        return;
      }

      // PUT updated HTML back
      const body = doc.querySelector('body');
      const putResp = await fetch(sourceUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/html' },
        credentials: 'include',
        body: body.outerHTML,
      });

      if (putResp.ok) {
        console.log('Alt text saved to DA');
      } else {
        console.error('DA save failed:', putResp.status);
      }
    } catch (err) {
      console.error('DA save error:', err);
    }
  }

  altEditor.querySelector('.palette-btn-ok').addEventListener('click', async () => {
    if (altTarget) {
      const newAlt = altEditor.querySelector('#qe-alt-input').value;

      // Update DOM
      altTarget.setAttribute('alt', newAlt);

      // Save to DA
      await saveAltToDA(altTarget, newAlt);
    }
    altEditor.classList.remove('open');
    altTarget = null;
  });

  // Inject alt text button into toolbar once it renders
  function injectAltButton() {
     console.log("injectAltButton");
    const toolbar = document.querySelector('.prosemirror-floating-toolbar');
    if (!toolbar || toolbar.querySelector('.toolbar-btn-alt')) return;

    const altBtn = document.createElement('span');
    altBtn.className = 'ProseMirror-menuitem';
    const altBtnInner = document.createElement('div');
    altBtnInner.title = 'Edit Image';
    altBtnInner.className = 'edit-image toolbar-btn-alt ProseMirror-menu-disabled';
    altBtnInner.textContent = 'Edit Image';
    altBtn.appendChild(altBtnInner);

    altBtnInner.addEventListener('mouseup', (ev) => {
      console.log("injectAltButton - addEvent mouseup");
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      ev.preventDefault();

      const img = lastSelectedImage;
      if (!img) return;

      altTarget = img;
      ensureAltEditorInDOM();
      altEditor.querySelector('#qe-alt-input').value = img.alt || '';

      // Position below the toolbar
      const toolbarRect = toolbar.getBoundingClientRect();
      altEditor.style.position = 'absolute';
      altEditor.style.top = `${toolbarRect.bottom + window.scrollY + 8}px`;
      altEditor.style.left = `${Math.max(8, toolbarRect.left)}px`;
      altEditor.classList.add('open');
      setTimeout(() => altEditor.querySelector('#qe-alt-input').focus(), 50);
      console.log("injectAltButton - addEvent mouseup end?");
    });

    toolbar.appendChild(altBtn);

    // Styles button for blocks and sections
    const stylesBtn = document.createElement('span');
    stylesBtn.className = 'ProseMirror-menuitem';
    const stylesBtnInner = document.createElement('div');
    stylesBtnInner.title = 'Edit Styles';
    stylesBtnInner.className = 'edit-styles toolbar-btn-styles ProseMirror-menu-disabled';
    stylesBtnInner.textContent = 'Edit Styles';
    stylesBtn.appendChild(stylesBtnInner);
    stylesBtnInner.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const selected = document.querySelector('.qe-selected');
      if (selected) {
        openStylePicker(selected);
      }
    });
    toolbar.appendChild(stylesBtn);
  }

  // Watch for toolbar to appear and inject buttons
  const toolbarObserver = new MutationObserver(injectAltButton);
  toolbarObserver.observe(document.body, { childList: true, subtree: true });

  // Detect element type from the raw click target
  function detectClick(rawTarget) {
    // 1. Image — clicked on img, picture, svg, video, or any element containing only media
    const img = rawTarget.closest('img, picture, svg, video, canvas, .product-card-image, .hero img, [class*="image"], [class*="img"]');
    if (img) return { target: img, type: 'image' };

    // Also check if rawTarget itself is media or its parent only contains media
    if (rawTarget.tagName === 'IMG' || rawTarget.tagName === 'PICTURE'
      || rawTarget.tagName === 'SVG' || rawTarget.tagName === 'VIDEO') {
      return { target: rawTarget, type: 'image' };
    }

    // Check if parent is an image wrapper (contains img but no text content)
    const parent = rawTarget.parentElement;
    if (parent && parent.querySelector('img') && !parent.textContent.trim()) {
      return { target: parent, type: 'image' };
    }

    // 2. Text — clicked on a text element
    const text = rawTarget.closest('p, h1, h2, h3, h4, h5, h6, li, a, span');
    if (text) return { target: text, type: 'text' };

    // 3. Block — clicked on a block container (not text/image inside it)
    const block = rawTarget.closest('[data-block-name]');
    if (block) return { target: block, type: 'block' };

    // 4. Section — clicked on the section background
    const section = rawTarget.closest('.section');
    if (section) return { target: section, type: 'section' };

    return { target: rawTarget, type: 'text' };
  }

  // Show toolbar and reposition above the clicked element
  document.addEventListener('click', (e) => {
    const toolbar = document.querySelector('.prosemirror-floating-toolbar');
    if (!toolbar) return;
    if (toolbar.contains(e.target)) return;

    // Close alt editor if open
    altEditor.classList.remove('open');

    toolbar.style.display = 'block';

    // Remove previous selection outline
    document.querySelectorAll('.qe-selected').forEach((el) => el.classList.remove('qe-selected'));

    // Detect what was clicked
    const { target, type } = detectClick(e.target);
    target.classList.add('qe-selected');
    const altBtnInnerEl = toolbar.querySelector('.toolbar-btn-alt');
    const stylesBtnInnerEl = toolbar.querySelector('.toolbar-btn-styles');
    const altBtnWrap = altBtnInnerEl?.closest('.ProseMirror-menuitem');
    const stylesBtnWrap = stylesBtnInnerEl?.closest('.ProseMirror-menuitem');

    // Hide all toolbar children first
    [...toolbar.children].forEach((child) => {
      child.style.display = 'none';
    });

    // Store image reference when image is selected
    if (type === 'image') {
      lastSelectedImage = target.tagName === 'IMG'
        ? target
        : target.querySelector('img') || target;
    } else {
      lastSelectedImage = null;
    }

    // Reset disabled state on custom buttons
    if (altBtnInnerEl) altBtnInnerEl.classList.add('ProseMirror-menu-disabled');
    if (stylesBtnInnerEl) stylesBtnInnerEl.classList.add('ProseMirror-menu-disabled');

    // Show buttons based on detected type
    if (type === 'image') {
      if (altBtnWrap) altBtnWrap.style.display = '';
      if (altBtnInnerEl) altBtnInnerEl.classList.remove('ProseMirror-menu-disabled');
    } else if (type === 'block' || type === 'section') {
      if (stylesBtnWrap) stylesBtnWrap.style.display = '';
      if (stylesBtnInnerEl) stylesBtnInnerEl.classList.remove('ProseMirror-menu-disabled');
    } else {
      // Text — show all default buttons, hide custom ones
      [...toolbar.children].forEach((child) => {
        if (child === altBtnWrap || child === stylesBtnWrap) {
          child.style.display = 'none';
        } else {
          child.style.display = '';
        }
      });
    }

    // Position toolbar above the element
    const rect = target.getBoundingClientRect();
    const toolbarHeight = toolbar.offsetHeight || 40;

    let top = rect.top + window.scrollY - toolbarHeight - 8;
    if (top < window.scrollY) {
      top = rect.bottom + window.scrollY + 8;
    }

    const left = Math.max(8, Math.min(
      rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2),
      window.innerWidth - toolbar.offsetWidth - 8,
    ));

    toolbar.style.position = 'absolute';
    toolbar.style.top = `${top}px`;
    toolbar.style.left = `${left}px`;
  });
}

async function loadModule(origin, payload) {
  const { default: loadQuickEdit } = await import(`${origin}/nx/public/plugins/quick-edit/quick-edit.js`);
  applyCustomizations();
  initStylePicker();
  loadQuickEdit(payload, loadPage);
}

// creates sidekick payload when loading QE from query param
function generateSidekickPayload() {
  let { hostname } = window.location;
  if (hostname === 'localhost') {
    hostname = document.querySelector('meta[property="hlx:proxyUrl"]').content;
  }
  const parts = hostname.split('.')[0].split('--');
  const [, repo, owner] = parts;

  return {
    detail: {
      config: { mountpoint: `https://content.da.live/${owner}/${repo}/` },
      location: { pathname: window.location.pathname },
    },
  };
}

export default function init(payload) {
  const { search } = window.location;
  const ref = new URLSearchParams(search).get('quick-edit');
  let origin;
  if (ref === 'on' || !ref) origin = 'https://da.live';
  if (ref === 'local') origin = 'http://localhost:6456';
  if (!origin) origin = `https://${ref}--da-nx--adobe.aem.live`;
  addImportmap();
  loadModule(origin, payload || generateSidekickPayload());
}
