import anime from 'animejs/lib/anime.es.js';

const createShadowClone = (target, shift, zIndex) => {
  const shadowClone = document.createElement('span');
  shadowClone.className = target.className;
  shadowClone.innerText = target.innerText;
  shadowClone.style.width = `${target.offsetWidth}px`;
  shadowClone.style.height = `${target.offsetHeight}px`;
  shadowClone.style.top = `${shift}em`;
  shadowClone.style.left = `${shift}em`;
  shadowClone.style.zIndex = `-${zIndex}`;

  target.insertAdjacentElement('afterend', shadowClone);
};

const btnComp = text => {
  const btn = document.createElement('button');
  btn.className =
    'relative uppercase text-center text-3xl md:text-6xl xl:text-5xl text-blue-promo px-12 md:px-24 xl:px-20 font-bold bg-white';
  btn.innerText = text;
  return btn;
};

const promoBtnWithClones = (wrapperEl, config) => {
  const btn = wrapperEl.querySelector('button');
  Array.from({ length: config.num }).forEach((_, i) => {
    const cloneIndex = ++i;
    createShadowClone(btn, cloneIndex * config.shift, cloneIndex);
  });
  const clonedWrapperEl = wrapperEl.cloneNode(true);
  return clonedWrapperEl;
};

const promoBtnComp = (text, config) => {
  const wrapperEl = document.createElement('div');
  wrapperEl.className =
    'promo-btn relative transition transition-all duration-300';
  const btn = btnComp(text);
  wrapperEl.append(btn);
  document.body.prepend(wrapperEl);

  const promoBtnEl = promoBtnWithClones(wrapperEl, config);
  wrapperEl.remove();
  promoBtnEl.onclick = () => {
    const button = promoBtnEl.querySelector('button');
    pressOnButton(button, config.shift);
    config.customEvents.onClick();
  };

  return promoBtnEl;
};

const pressOnButton = (target, shift) => {
  anime
    .timeline({
      targets: target,
      easing: 'easeInOutQuint',
      duration: 50,
    })
    .add({
      translateX: `${shift}em`,
      translateY: `${shift}em`,
    })
    .add({
      delay: 20,
      translateX: 0,
      translateY: 0,
    });
};

export default promoBtnComp;
