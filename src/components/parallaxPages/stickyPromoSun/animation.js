import anime from 'animejs/lib/anime.es.js';
import scroll from '../../../shared/scroll';
import animConfig from '../../../shared/animation';

const parallaxPages = document.querySelector('.parallax-pages');
const courseIntroPage = parallaxPages.querySelector(
  '.promo-page_course-introduction'
);
const contactPage = parallaxPages.querySelector('.promo-page_contact');

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

const animateSecondPromo = target => {
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
      complete: () => target.remove(),
    })
    .add({
      targets: promoIllustrationEl,
      opacity: 1,
    });
};

const moveToFirstStage = (props, target) => {
  anime
    .timeline({
      targets: target,
      ...promoAnimConfig,
    })
    .add({
      delay: 300,
      scale: 1,
    })
    .add({
      translateX: `${props.x}px`,
    })
    .add({
      begin: () => target.classList.add('arrived'),
      complete: () => animateFirstPromo(),
    });
};

const moveToSecondStage = (props, target) => {
  anime
    .timeline({
      targets: target,
      ...promoAnimConfig,
    })
    .add({
      translateX: `${window.innerWidth - props.width - props.x}px`,
      complete: () => animateSecondPromo(target),
    });
};

const startAnimate = (cb, props, target) => {
  anime({
    targets: target,
    ...animConfig,
    easing: 'linear',
    duration: 800,
    opacity: 1,
    begin: () => scroll('down'),
    complete: () => cb(props, target),
  });
};

export { startAnimate, moveToFirstStage, moveToSecondStage };
