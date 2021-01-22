import anime from 'animejs/lib/anime.es.js';
import scroll from '../../shared/scroll';
import animConfig from '../../shared/animation';
import promoBtn from '../UI/promoBtn';

const parallaxPages = document.querySelector('.parallax-pages');
const courseIntroPage = parallaxPages.querySelector(
  '.promo-page_course-introduction'
);
const contactPage = parallaxPages.querySelector('.promo-page_contact');

// Take the element which sticky promo sun will become
let predefinedElProps = null;

const predefineEl = document.querySelector('.promo-sun');
predefinedElProps = predefineEl.getBoundingClientRect();

const promoSunWrapper = () => {
  const stickySunWrapperEl = document.createElement('div');
  stickySunWrapperEl.className =
    'sticky-sun-wrapper w-screen absolute top-0 left-0';
  stickySunWrapperEl.style.height = `${
    parallaxPages.querySelectorAll('.page').length * 100
  }%`;

  return stickySunWrapperEl;
};

const stickyPromoSun = () => {
  const stickyPromoSunEl = document
    .getElementById('promo-sun-temp')
    .content.cloneNode(true).firstElementChild;
  stickyPromoSunEl.id = 'sticky-promo-sun';
  const width = predefineEl.clientWidth;
  const height = predefineEl.clientHeight;
  const scale = 1.4;
  const shiftLeft = window.innerWidth / 2 - width / 2;
  const shiftTop = window.innerHeight / 2 - height / 2;

  stickyPromoSunEl.style.width = `${width}px`;
  stickyPromoSunEl.style.height = `${height}px`;
  stickyPromoSunEl.style.transform = `translateX(${shiftLeft}px) translateY(${shiftTop}px) scale(${scale})`;
  return stickyPromoSunEl;
};

// Init
const stickyPromoSunEl = stickyPromoSun();
const stickySunWrapperEl = promoSunWrapper();
stickySunWrapperEl.append(stickyPromoSunEl);
parallaxPages.prepend(stickySunWrapperEl);

const startButton = parallaxPages
  .querySelector('.promo-page')
  .querySelector('.scroll-btns').children[1];
startButton.onclick = () => startAnimate(moveToFirstStage);

// Animation
const promoAnimConfig = {
  easing: 'linear',
  duration: 500,
};

const animateFirstPromo = () => {
  const promoIllustrationEl = courseIntroPage.querySelector(
    '.promo__illustration'
  );
  const waveEl = courseIntroPage.querySelector('.wave');
  const secondarySvg = courseIntroPage.querySelector(
    '.promo-illustration__secondary'
  );
  const promoInfoEl = courseIntroPage.querySelector('.promo__info');

  anime({
    targets: [promoIllustrationEl, waveEl],
    ...animConfig,
    opacity: 1,
  });

  anime({
    targets: [promoInfoEl, secondarySvg],
    ...animConfig,
    translateX: (el, _, __) => [el.dataset.moveFrom, '0px'],
  });
};

const animateSecondPromo = () => {
  const waveEl = contactPage.querySelector('.wave');
  const promoContactEl = contactPage.querySelector('.promo__contact');
  const promoInfoEl = contactPage.querySelector('.promo__info');
  const promoIllustrationEl = contactPage.querySelector('.promo__illustration');
  const promoBtn = contactPage.querySelector('.promo-btn');

  anime({
    targets: [waveEl, promoBtn],
    ...animConfig,
    opacity: 1,
  });

  anime
    .timeline({
      targets: [promoInfoEl, promoContactEl],
      ...animConfig,
      translateX: (el, _, __) => [el.dataset.moveFrom, '0px'],
      complete: () => stickySunWrapperEl.remove(),
    })
    .add({
      targets: promoIllustrationEl,
      opacity: 1,
    });
};

const moveToFirstStage = () => {
  anime
    .timeline({
      targets: stickyPromoSunEl,
      ...promoAnimConfig,
    })
    .add({
      delay: 300,
      scale: 1,
    })
    .add({
      translateX: `${predefinedElProps.x}px`,
    })
    .add({
      begin: () => stickyPromoSunEl.classList.add('arrived'),
      complete: () => animateFirstPromo(),
    });
};
const moveToSecondStage = () => {
  anime
    .timeline({
      targets: stickyPromoSunEl,
      ...promoAnimConfig,
    })
    .add({
      translateX: `${
        window.innerWidth - predefinedElProps.width - predefinedElProps.x
      }px`,
      complete: () => animateSecondPromo(),
    });
};

const startAnimate = cb => {
  anime({
    targets: stickyPromoSunEl,
    ...animConfig,
    easing: 'linear',
    duration: 800,
    opacity: 1,
    begin: () => scroll('down'),
    complete: () => cb(),
  });
};

const btnConfig = {
  num: 1,
  shift: 0.3,
  customEvents: {
    onClick: () => startAnimate(moveToSecondStage),
  },
};

const confirmButton = courseIntroPage.querySelector('.promo-btn');
const newButton = promoBtn('YES!', btnConfig);
confirmButton.replaceWith(newButton);
