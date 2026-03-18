import { getConfig } from '../../scripts/ak.js';

const { log } = getConfig();

function getCarouselList(slides, carouselPanels) {
  const carouselItems = tabs.querySelectorAll('li');
  const carouselList = document.createElement('div');
  carouselList.className = 'carousel-list';
  carouselList.role = 'carouselList';

  for (const [idx, tab] of carouselItems.entries()) {
    const btn = document.createElement('button');
    btn.role = 'tab';
    btn.id = `tab-${idx + 1}`;
    btn.textContent = tab.textContent;
    if (idx === 0) {
      btn.classList.add('is-active');
      carouselPanels[0].classList.add('is-visible');
    }
    carouselList.append(btn);

    btn.addEventListener('click', () => {
      // Remove all active styles
      carouselList.querySelectorAll('button')
        .forEach((button) => { button.classList.remove('is-active'); });

      carouselPanels.forEach((sec) => { sec.classList.remove('is-visible'); });
      carouselPanels[idx].classList.add('is-visible');
      btn.classList.add('is-active');
    });
  }
  return carouselList;
}
 
export default function init(el) {
  // Find the top most parent where all tab sections live
  const parent = el.closest('.fragment-content, main');

  // Forefully hide parent because sections may not be loaded yet
  parent.style = 'display: none;';

  // Find the tab items
  const carousel = el.querySelector('.advanced-carousel ul');
  if (!carousel) {
    log('Please add an unordered list to the advanced tabs block.');
    return;
  }
  // Find the section
  const currSection = el.closest('.section');
  
  // Find the section that contains the actual block and only add class to tab sections
  const currSectionat = el.closest('.section .advanced-carousel');
  const tabSectionItem = currSectionat.closest('.section').classList.add("carouselSection");
  const tabSection = document.querySelectorAll('.carouselSection ~ .section');
  const carouselItems = document.querySelector(".advanced-carousel ul");
  const carouselCount = carouselItems.childElementCount;

  tabSection.forEach((element, index) => {
    if (index < carouselCount) {
     element.classList.add("carouselSection");
    }
   
  });

  // Filter and format all sections that do not hold the tabs block
  const carouselPanels = [...parent.querySelectorAll(':scope > .carouselSection')]
    .reduce((acc, section, idx) => {
      if (section !== currSection) {
        section.id = `carouselpanel-${idx + 1}`;
        section.role = 'carouselpanel';
        section.setAttribute('aria-labelledby', `tab-${idx + 1}`);
        acc.push(section);
      }
      return acc;
    }, []);

  const carouselList = getCarouselList(slides, carouselPanels);

  tabs.remove();
  el.append(carouselList, ...carouselPanels);
  parent.removeAttribute('style');
}