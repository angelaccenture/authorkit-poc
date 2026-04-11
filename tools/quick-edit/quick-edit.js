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
    .toolbar-btn-styles {
      cursor: pointer;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fff;
      margin-left: 4px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      white-space: nowrap;
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
  document.body.appendChild(altEditor);

  let altTarget = null;
  let lastSelectedImage = null;

  altEditor.querySelector('.palette-btn-cancel').addEventListener('click', () => {
    altEditor.classList.remove('open');
    altTarget = null;
  });

  altEditor.querySelector('.palette-btn-ok').addEventListener('click', () => {
    if (altTarget) {
      altTarget.alt = altEditor.querySelector('#qe-alt-input').value;
    }
    altEditor.classList.remove('open');
    altTarget = null;
  });

  // Inject alt text button into toolbar once it renders
  function injectAltButton() {
    const toolbar = document.querySelector('.prosemirror-floating-toolbar');
    if (!toolbar || toolbar.querySelector('.toolbar-btn-alt')) return;

    const altBtn = document.createElement('span');
    altBtn.className = 'proseMirror-menuitem toolbar-btn-alt';
    altBtn.title = 'Edit Image';
    altBtn.textContent = 'Edit Image';
    altBtn.classList.add('toolbar-btn-styles');

    altBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      const img = lastSelectedImage;
      if (!img) return;

      altTarget = img;
      altEditor.querySelector('#qe-alt-input').value = img.alt || '';

      // Position below the toolbar
      const toolbarRect = toolbar.getBoundingClientRect();
      altEditor.style.position = 'absolute';
      altEditor.style.top = `${toolbarRect.bottom + window.scrollY + 8}px`;
      altEditor.style.left = `${Math.max(8, toolbarRect.left)}px`;
      altEditor.classList.add('open');
      setTimeout(() => altEditor.querySelector('#qe-alt-input').focus(), 50);
    });

    toolbar.appendChild(altBtn);

    // Styles button for blocks and sections
    const stylesBtn = document.createElement('span');
    stylesBtn.className = 'proseMirror-menuitem toolbar-btn-styles';
    stylesBtn.title = 'Edit Styles';
    stylesBtn.textContent = 'Edit Styles';
    stylesBtn.addEventListener('click', (ev) => {
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
    // 1. Image — clicked directly on img or picture
    const img = rawTarget.closest('img, picture');
    if (img) return { target: img, type: 'image' };

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
    const altBtnEl = toolbar.querySelector('.toolbar-btn-alt');
    const stylesBtnEl = toolbar.querySelector('.toolbar-btn-styles');

    // Hide all toolbar children first
    [...toolbar.children].forEach((child) => {
      child.style.display = 'none';
    });

    // Store image reference when image is selected
    if (type === 'image') {
      lastSelectedImage = target.tagName === 'IMG' ? target : target.querySelector('img');
    } else {
      lastSelectedImage = null;
    }

    // Show buttons based on detected type
    if (type === 'image') {
      if (altBtnEl) altBtnEl.style.display = 'inline-flex';
    } else if (type === 'block' || type === 'section') {
      if (stylesBtnEl) stylesBtnEl.style.display = 'inline-flex';
    } else {
      // Text — show all default buttons, hide custom ones
      [...toolbar.children].forEach((child) => {
        if (child === altBtnEl || child === stylesBtnEl) {
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
