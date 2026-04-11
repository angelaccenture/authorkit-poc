import { loadPage } from '../../scripts/scripts.js';
import initStylePicker from './style-picker.js';

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
    .qe-alt-editor {
      position: absolute;
      z-index: 100001;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
      padding: 12px;
      width: 300px;
      font-family: system-ui, sans-serif;
      display: none;
    }
    .qe-alt-editor.open { display: block; }
    .qe-alt-editor label {
      font-size: 12px;
      font-weight: 600;
      color: #555;
      display: block;
      margin-bottom: 4px;
    }
    .qe-alt-editor textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      min-height: 60px;
    }
    .qe-alt-editor textarea:focus {
      outline: none;
      border-color: #0078d4;
    }
    .qe-alt-editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    .qe-alt-editor-actions button {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid #ddd;
      background: #f5f5f5;
      color: #333;
    }
    .qe-alt-editor-actions button.qe-alt-save {
      background: #0078d4;
      color: #fff;
      border-color: #0078d4;
    }
  `;
  document.head.appendChild(style);

  // Alt text editor panel
  const altEditor = document.createElement('div');
  altEditor.className = 'qe-alt-editor';
  altEditor.innerHTML = `
    <label for="qe-alt-input">Alt text</label>
    <textarea id="qe-alt-input" placeholder="Describe this image..."></textarea>
    <div class="qe-alt-editor-actions">
      <button class="qe-alt-cancel">Cancel</button>
      <button class="qe-alt-save">Save</button>
    </div>
  `;
  document.body.appendChild(altEditor);

  let altTarget = null;

  altEditor.querySelector('.qe-alt-cancel').addEventListener('click', () => {
    altEditor.classList.remove('open');
    altTarget = null;
  });

  altEditor.querySelector('.qe-alt-save').addEventListener('click', () => {
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
    altBtn.title = 'Edit alt text';
    altBtn.textContent = 'Alt';
    altBtn.style.cssText = 'cursor:pointer;padding:4px 8px;font-size:12px;font-weight:600;border:1px solid #ddd;border-radius:4px;background:#fff;margin-left:4px;height:32px;width:40px;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;';

    altBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const selected = document.querySelector('.qe-selected');
      const img = selected?.tagName === 'IMG'
        ? selected
        : selected?.querySelector('img');
      if (!img) return;

      altTarget = img;
      altEditor.querySelector('#qe-alt-input').value = img.alt || '';

      const rect = img.getBoundingClientRect();
      altEditor.style.top = `${rect.bottom + window.scrollY + 8}px`;
      altEditor.style.left = `${Math.max(8, rect.left)}px`;
      altEditor.classList.add('open');
      altEditor.querySelector('#qe-alt-input').focus();
    });

    toolbar.appendChild(altBtn);
  }

  // Watch for toolbar to appear and inject button
  const toolbarObserver = new MutationObserver(injectAltButton);
  toolbarObserver.observe(document.body, { childList: true, subtree: true });

  // Show toolbar and reposition above the clicked element
  document.addEventListener('click', (e) => {
    const toolbar = document.querySelector('.prosemirror-floating-toolbar');
    if (!toolbar) return;
    if (toolbar.contains(e.target)) return;

    toolbar.style.display = 'block';

    // Remove previous selection outline
    document.querySelectorAll('.qe-selected').forEach((el) => el.classList.remove('qe-selected'));

    // Find the clicked element to position above and outline
    const target = e.target.closest('picture, img, p, h1, h2, h3, h4, h5, h6, li, a, div.block, [data-block-name], .section')
      || e.target;
    target.classList.add('qe-selected');

    // Context-aware toolbar: show/hide buttons based on element type
    const isImage = target.tagName === 'IMG' || target.tagName === 'PICTURE' || !!target.querySelector('img');
    const altBtn = toolbar.querySelector('.toolbar-btn-alt');
    const textBtns = toolbar.querySelectorAll('.proseMirror-menuitem:not(.toolbar-btn-alt)');

    if (isImage) {
      if (altBtn) altBtn.style.display = 'inline-flex';
      textBtns.forEach((btn) => { btn.style.display = 'none'; });
    } else {
      if (altBtn) altBtn.style.display = 'none';
      textBtns.forEach((btn) => { btn.style.display = ''; });
    }
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
