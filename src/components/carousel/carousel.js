import { getCarouselItems } from '../../store/carousel';
import { changeItem } from '../../store/carousel';

const carouselSwitchersComp = (items, className) => {
  const carouselSwitchersWrapperEl = document.createElement('div');
  carouselSwitchersWrapperEl.className = `carousel__switchers-wrapper absolute space-x-1 cursor-pointer flex ${className}`;

  items.forEach(() => {
    const carouselSwitcherEl = document.createElement('span');
    carouselSwitcherEl.className =
      'carousel__switcher w-3 h-3 md:w-4 md:h-4 xl:w-3 xl:h-3 rounded-full bg-black opacity-25 transition-all duration-300';
    carouselSwitchersWrapperEl.append(carouselSwitcherEl);
  });
  carouselSwitchersWrapperEl.firstElementChild.classList.add('active');

  return carouselSwitchersWrapperEl;
};

const carouselComp = (classes, itemComponent, customEvents) => {
  const carouselItems = getCarouselItems();
  const itemEls = carouselItems.map((item, index) =>
    itemComponent(item, index)
  );
  const carouselEl = document.createElement('div');
  carouselEl.className = `carousel ${classes.carousel}`;
  carouselEl.innerHTML = `
    <div class="carousel__inner h-full overflow-visible w-full">

    </div>
  `;
  const switchersEl = carouselSwitchersComp(itemEls, classes.switchersWrapper);
  switchersEl.onclick = () =>
    updateCarousel(switchersEl, customEvents, itemComponent);

  carouselEl.append(switchersEl);
  itemEls.map(el => {
    carouselEl.querySelector('.carousel__inner').append(el);

    return el;
  });

  return carouselEl;
};

const renderCarouselItems = (container, itemComponent) => {
  const carouselItems = getCarouselItems();
  const itemEls = carouselItems.map((item, index) =>
    itemComponent(item, index)
  );
  const carouselEl = container.querySelector('.carousel');
  const carouselInner = carouselEl.querySelector('.carousel__inner');
  carouselInner.innerHTML = '';
  itemEls.map(el => {
    carouselInner.append(el);
  });
};

export default carouselComp;

// Events
let activeSwitcher = 0;
const changeActiveSwitcher = wrapper => {
  const activeDots = Array.from(wrapper.children);
  activeDots.forEach(el => el.classList.remove('active'));
  if (activeDots[activeSwitcher + 1]) {
    activeSwitcher += 1;
  } else {
    activeSwitcher = 0;
  }
  activeDots[activeSwitcher].classList.add('active');
};

let allowUpdate = true;
const updateCarousel = (wrapper, customEvents, itemComponent) => {
  if (!allowUpdate) return;
  allowUpdate = false;
  // Callback izs fired after carousel was updated - update carousel's array
  const innerCallback = () =>
    renderCarouselItems(customEvents.container, itemComponent);
  const callback = () => {
    changeItem(innerCallback);
    allowUpdate = true;
  };

  const items = getCarouselItems();
  customEvents.onClickHandler(callback, items);
  changeActiveSwitcher(wrapper);
};

export { renderCarouselItems };
