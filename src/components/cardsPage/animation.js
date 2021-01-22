import anime from 'animejs/lib/anime.es.js';
import animConfig from '@src/shared/animation';
import * as dimensions from '../../shared/dimensions';
import { cardShift } from '../../store/cards';

const mobResolution = dimensions.curDimension !== dimensions.X_LARGE;
const cardsPage = document.querySelector('.cards-page');

const animateCarousel = (cb, items) => {
  const carouselEl = cardsPage.querySelector('.carousel');
  const carouselInnerEl = carouselEl.querySelector('.carousel__inner');
  const last = items.length - 1;
  const carouselItems = Array.from(carouselInnerEl.children);

  const newFirstItem = carouselItems[last];

  const {
    translateDir,
    from,
    to,
    fCustomTranslate,
    sCustomTranslate,
  } = getCardShift(carouselItems.length - 1, newFirstItem);

  anime
    .timeline({
      targets: newFirstItem,
      ...animConfig,
    })
    .add({
      [translateDir]: [from, to],
    })
    .add({
      delay: 300,
      [translateDir]: [to, 0],
      begin: () => (newFirstItem.style.zIndex = 10),
    })
    .add({
      targets: carouselItems.slice(0, carouselItems.length - 1),
      // Shift the cards
      [translateDir]: [fCustomTranslate, sCustomTranslate],
      complete: () => cb(),
    });
};

const getCardShift = (lastCardShift, card) => {
  const { clientHeight, clientWidth } = card;
  let translateDir, from, to, fCustomTranslate, sCustomTranslate;

  if (mobResolution) {
    from = `-${lastCardShift * cardShift}em`;
    to = `-${window.innerHeight / 2 - clientHeight / 2 - 10}px`;
    translateDir = 'translateY';
    fCustomTranslate = (_, i, __) => {
      return `-${i * 2}em`;
    };
    sCustomTranslate = (_, i, __) => {
      return `-${(i + 1) * 2}em`;
    };
  } else {
    from = `${lastCardShift * cardShift}em`;
    to = `${window.innerWidth / 2 - clientWidth / 2 - 50}px`;
    translateDir = 'translateX';
    fCustomTranslate = (_, i, __) => {
      return `${i * 2}em`;
    };
    sCustomTranslate = (_, i, __) => {
      return `${(i + 1) * 2}em`;
    };
  }

  return {
    translateDir,
    from,
    to,
    fCustomTranslate,
    sCustomTranslate,
  };
};

export default animateCarousel;
