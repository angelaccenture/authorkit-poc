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
  // Quick-edit toolbar may render in Shadow DOM — use MutationObserver
  // to find and hide the underline button once it appears
  const observer = new MutationObserver(() => {
    // Try regular DOM first
    document.querySelectorAll('[command="underline"], [title="Underline"], [data-command="underline"]').forEach((btn) => {
      btn.style.display = 'none';
    });

    // Try Shadow DOM in any custom elements
    document.querySelectorAll('da-quick-edit, da-toolbar, [class*="toolbar"], [class*="quick-edit"]').forEach((el) => {
      const shadow = el.shadowRoot;
      if (shadow) {
        shadow.querySelectorAll('[command="underline"], [title="Underline"], [data-command="underline"], button').forEach((btn) => {
          if (btn.title === 'Underline' || btn.getAttribute('command') === 'underline'
            || btn.textContent.trim().toLowerCase() === 'underline') {
            btn.style.display = 'none';
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also inject global CSS as fallback
  const style = document.createElement('style');
  style.textContent = `
    [command="underline"],
    [title="Underline"],
    [data-command="underline"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
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
