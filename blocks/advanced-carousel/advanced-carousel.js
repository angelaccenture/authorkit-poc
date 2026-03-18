import { getConfig } from '../../scripts/ak.js';

const { log } = getConfig();

function updateNavButtons(prevBtn, nextBtn, activeIndex, total) {
  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === total - 1;
}

function goToSlide(index, carouselList, carouselPanels, prevBtn, nextBtn) {
  const buttons = carouselList.querySelectorAll('.carousel-slide-indicator button');
  buttons.forEach((button) => { button.classList.remove('is-active'); });
  carouselPanels.forEach((sec) => { sec.classList.remove('is-visible'); });

  buttons[index].classList.add('is-active');
  carouselPanels[index].classList.add('is-visible');
  updateNavButtons(prevBtn, nextBtn, index, carouselPanels.length);
}

function getActiveIndex(carouselList) {
  const buttons = [...carouselList.querySelectorAll('.carousel-slide-indicator button')];
  return buttons.findIndex((btn) => btn.classList.contains('is-active'));
}

function getCarouselList(carousel, carouselPanels) {
  const carouselItems = carousel.querySelectorAll('li');
  const carouselList = document.createElement('div');
  carouselList.className = 'carousel-list carousel-slide-indicators';
  carouselList.role = 'carousellist';

  for (const [idx, item] of carouselItems.entries()) {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-slide-indicator';

    const btn = document.createElement('button');
    btn.role = 'carousel';
    btn.id = `carousel-${idx + 1}`;
    btn.textContent = item.textContent;
    if (idx === 0) {
      btn.classList.add('is-active');
      carouselPanels[0].classList.add('is-visible');
    }
    indicator.append(btn);
    carouselList.append(indicator);
  }
  return carouselList;
}

function createNavButtons() {
  const nav = document.createElement('div');
  nav.className = 'carousel-navigation-buttons';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'slide-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.disabled = true;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'slide-next';
  nextBtn.setAttribute('aria-label', 'Next slide');

  nav.append(prevBtn, nextBtn);
  return { nav, prevBtn, nextBtn };
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
        section.role = 'carouselpanel';
        section.setAttribute('aria-labelledby', `carousel-${idx + 1}`);
        acc.push(section);
      }
      return acc;
    }, []);

  const carouselList = getCarouselList(carousel, carouselPanels);
  const { nav, prevBtn, nextBtn } = createNavButtons();

  // Wire up indicator button clicks
  carouselList.querySelectorAll('.carousel-slide-indicator button').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      goToSlide(idx, carouselList, carouselPanels, prevBtn, nextBtn);
    });
  });

  // Wire up prev/next buttons
  prevBtn.addEventListener('click', () => {
    const activeIndex = getActiveIndex(carouselList);
    if (activeIndex > 0) {
      goToSlide(activeIndex - 1, carouselList, carouselPanels, prevBtn, nextBtn);
    }
  });

  nextBtn.addEventListener('click', () => {
    const activeIndex = getActiveIndex(carouselList);
    if (activeIndex < carouselPanels.length - 1) {
      goToSlide(activeIndex + 1, carouselList, carouselPanels, prevBtn, nextBtn);
    }
  });

  carousel.remove();
  el.append(nav, ...carouselPanels, carouselList);
  parent.removeAttribute('style');
}
