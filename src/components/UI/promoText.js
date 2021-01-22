const addStyles = (el, stylesObj) => {
  Object.entries(stylesObj).forEach(
    selector => (el.style[selector[0]] = selector[1])
  );
};

const styleTextClones = (clones, styles, shift) => {
  const textWrapper = document.createElement('div');
  textWrapper.className = 'relative w-full h-auto';
  clones.forEach((el, i) => {
    const { mainNode, cloneStyles } = styles;
    el.style.top = `${i * shift}em`;
    el.style.zIndex = -i;
    el.style.left = `${i * shift}em`;
    if (cloneStyles[i]) addStyles(el, cloneStyles[i]);
    if (i === 0) {
      el.className = `${el.className} ${mainNode}`;
    }
    textWrapper.append(el);
  });

  return textWrapper;
};

const promoText = (text, config, styles) => {
  const textClones = text.map(w => {
    const cloneEl = document.createElement('h4');
    cloneEl.innerText = w;
    cloneEl.className =
      'absloute capitalize w-full text-4xl md:text-6xl xl:text-5xl font-extrabold t-stroke-2 md:t-stroke-3 xl:t-stroke-2';
    return new Array(config.num).fill(1).map(_ => cloneEl.cloneNode(true));
  });

  const textCloneEls = textClones.map((clones, i) => {
    const textCloneEl = styleTextClones(clones, styles, config.shift);
    if (styles.wrapperStyles[i])
      addStyles(textCloneEl, styles.wrapperStyles[i]);
    return textCloneEl;
  });
  return textCloneEls;
};

export default promoText;
