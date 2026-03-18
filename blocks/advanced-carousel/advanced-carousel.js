import { getConfig } from '../../scripts/ak.js';

const { log } = getConfig();

function getCarouselList(carousel, carouselPanels) {
  const carouselItems = carousel.querySelectorAll('li');
  const carouselList = document.createElement('div');
  carouselList.className = 'carousel-list';
  carouselList.role = 'tablist';

  for (const [idx, item] of carouselItems.entries()) {
    const btn = document.createElement('button');
    btn.role = 'tab';
    btn.id = `carousel-${idx + 1}`;
    btn.textContent = item.textContent;
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
  // Find the top most parent where all carousel sections live
  const parent = el.closest('.fragment-content, main');

  // Forcefully hide parent because sections may not be loaded yet
  parent.style = 'display: none;';

  // Find the carousel items
  const carousel = el.querySelector('.advanced-carousel ul');
  if (!carousel) {
    log('Please add an unordered list to the advanced carousel block.');
    return;
  }
  // Find the section
  const currSection = el.closest('.section');

  // Find the section that contains the actual block and only add class to carousel sections
  const currSectionAt = el.closest('.section .advanced-carousel');
  currSectionAt.closest('.section').classList.add('carouselSection');
  const carouselSection = document.querySelectorAll('.carouselSection ~ .section');
  const carouselItems = document.querySelector('.advanced-carousel ul');
  const carouselCount = carouselItems.childElementCount;

  carouselSection.forEach((element, index) => {
    if (index < carouselCount) {
      element.classList.add('carouselSection');
    }
  });

  // Filter and format all sections that do not hold the carousel block
  const carouselPanels = [...parent.querySelectorAll(':scope > .carouselSection')]
    .reduce((acc, section, idx) => {
      if (section !== currSection) {
        section.id = `carouselpanel-${idx + 1}`;
        section.role = 'tabpanel';
        section.setAttribute('aria-labelledby', `carousel-${idx + 1}`);
        acc.push(section);
      }
      return acc;
    }, []);

  const carouselList = getCarouselList(carousel, carouselPanels);

  carousel.remove();
  el.append(carouselList, ...carouselPanels);
  parent.removeAttribute('style');
}
