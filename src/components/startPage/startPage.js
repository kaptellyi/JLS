import '@styles/start-page/start-page.css';
import anime from 'animejs/lib/anime.es.js';
import animConfig from '../../shared/animation';
import scroll from '../../shared/scroll';
import * as dimensions from '../../shared/dimensions';

const startPage = document.querySelector('.start-page');
const heroEl = startPage.querySelector('.hero');
const heroWrapper = heroEl.parentElement;
const heroTextEl = startPage.querySelector('.hero-text');
const petalsTemp = document.getElementById('petals');
const startBtn = startPage.querySelector('#start-btn');

if (dimensions.curDimension === dimensions.X_LARGE) {
  const els = petalsTemp.content.cloneNode(true).children;
  Array.from(els).forEach(el => startPage.append(el));
}
const petals = startPage.querySelectorAll('.petals');

const animateHeroText = () => {
  anime({
    targets: heroTextEl,
    ...animConfig,
    opacity: 1,
  });
};

const levitateAnimation = {};
export const levitatePetals = (index, angl) => {
  const target = petals[index];
  let angle = angl || Math.PI / 2;
  const animation = (time, lastTime) => {
    if (lastTime) angle += (time - lastTime) * 0.001;
    const axiosY = Math.sin(angle) * 1;
    const axiosX = Math.cos(angle) * 1;
    if (index === 0) {
      target.style.transform = `translate(${axiosX}%, ${axiosY}%)`;
    } else target.style.transform = `translate(${-axiosX}%, ${-axiosY}%)`;
    levitateAnimation[index] = {
      animStamp: requestAnimationFrame(newTime => animation(newTime, time)),
      angle,
    };
  };

  const oldAnimation = levitateAnimation[index];
  if (oldAnimation)
    return requestAnimationFrame(newTime =>
      animation(newTime, oldAnimation.animStamp, oldAnimation.angle)
    );
  window.requestAnimationFrame(animation);
};

export const resumePetalsLevitation = () =>
  petals.forEach((_, i) => levitatePetals(i));

const animatePetals = () => {
  anime({
    targets: petals[0],
    ...animConfig,
    translateX: ['-1000px', '0px'],
    translateY: ['1000px', '0px'],
  });

  anime({
    targets: petals[petals.length - 1],
    ...animConfig,
    translateX: ['1000px', '0px'],
    translateY: ['-1000px', '0px'],
  });
};

const animateScrollBtn = () => {
  anime({
    targets: startBtn,
    ...animConfig,
    easing: 'spring(1, 100, 10, 10)',
    translateY: ['3em', '0em'],
    opacity: 1,
  });

  anime({
    targets: startBtn.firstElementChild,
    easing: 'linear',
    delay: 1000,
    loop: true,
    duration: 1000,
    translateY: '100%',
    opacity: 0,
  });
};

const adjustBackHero = () => {
  heroWrapper.style.maxHeight = heroWrapper.dataset.max;
  heroWrapper.style.zIndex = 0;
  anime.remove(petals);
};

const animateHero = () => {
  anime({
    targets: heroWrapper,
    ...animConfig,
    zIndex: 1,
    maxHeight: '100vh',
    complete: e => {
      scroll('down');
      setTimeout(() => adjustBackHero(), e.currentTime * 1.5);
    },
  });
};

startBtn.onclick = () => {
  import(
    /* webpackChunkName: "cardsPage" */
    '@src/components/cardsPage/cardsPage'
  );
  animateHero();
  if (dimensions.curDimension === dimensions.X_LARGE) {
    Array.from(petals).forEach((el, i) =>
      window.cancelAnimationFrame(levitateAnimation[i].animStamp)
    );
  }
};

const startAnimation = () => {
  anime
    .timeline({
      ...animConfig,
      duration: 500,
    })
    .add({
      targets: heroWrapper,
      easing: 'linear',
      maxHeight: heroWrapper.dataset.max,
      begin: () => animateHeroText(),
    })
    .add({
      targets: heroEl,
      translateX: '-5%',
      ...animConfig.duration,
      begin: () => {
        animateScrollBtn();
        if (dimensions.curDimension === dimensions.X_LARGE) animatePetals();
      },
      complete: () => petals.forEach((_, i) => levitatePetals(i)),
    });
};

startAnimation();
