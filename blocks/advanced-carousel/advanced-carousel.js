import { getConfig } from '../../scripts/ak.js';

const { log } = getConfig();

function getTabList(tabs, tabPanels) {
  const tabItems = tabs.querySelectorAll('li');
  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.role = 'tablist';

  for (const [idx, tab] of tabItems.entries()) {
    const btn = document.createElement('button');
    btn.role = 'tab';
    btn.id = `tab-${idx + 1}`;
    btn.textContent = tab.textContent;
    if (idx === 0) {
      btn.classList.add('is-active');
      tabPanels[0].classList.add('is-visible');
    }
    tabList.append(btn);

    btn.addEventListener('click', () => {
      // Remove all active styles
      tabList.querySelectorAll('button')
        .forEach((button) => { button.classList.remove('is-active'); });

      tabPanels.forEach((sec) => { sec.classList.remove('is-visible'); });
      tabPanels[idx].classList.add('is-visible');
      btn.classList.add('is-active');
    });
  }
  return tabList;
}
 
export default function init(el) {
  // Find the top most parent where all tab sections live
  const parent = el.closest('.fragment-content, main');

  // Forefully hide parent because sections may not be loaded yet
  parent.style = 'display: none;';

  // Find the tab items
  const tabs = el.querySelector('.advanced-tabs ul');
  if (!tabs) {
    log('Please add an unordered list to the advanced tabs block.');
    return;
  }
  // Find the section 
  const currSection = el.closest('.section');

   // Find the section that contains the actual block and only add class to tab sections
  const currSectionat = el.closest('.section .advanced-tabs');
  const tabSectionItem = currSectionat.closest('.section').classList.add("tabSection");
  const tabSection = document.querySelectorAll('.tabSection ~ .section');
  const tabItems = document.querySelector(".advanced-tabs ul");
  const tabCount = tabItems.childElementCount;

  tabSection.forEach((element, index) => {
    if (index < tabCount) {
     element.classList.add("tabSection");
    }
   
  });

  // Filter and format all sections that do not hold the tabs block
  const tabPanels = [...parent.querySelectorAll(':scope > .tabSection')]
    .reduce((acc, section, idx) => {
      if (section !== currSection) {
        section.id = `tabpanel-${idx + 1}`;
        section.role = 'tabpanel';
        section.setAttribute('aria-labelledby', `tab-${idx + 1}`);
        acc.push(section);
      }
      return acc;
    }, []);

  const tabList = getTabList(tabs, tabPanels);

  tabs.remove();
  el.append(tabList, ...tabPanels);
  parent.removeAttribute('style');
}