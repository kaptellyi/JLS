import scroll from '../../shared/scroll';

const scrollButtons = customEvent => {
  const wrapper = document.createElement('div');
  wrapper.className =
    'scroll-btns absolute x-centered bottom-5 xl:left-auto xl:right-0 flex';
  wrapper.innerHTML = `
    <i class="ic md:ic-md xl:ic i-scroll-up" data-direction="up"></i>
    <i class="ic md:ic-md xl:ic i-scroll-down" data-direction="down"></i>
  `;
  wrapper.onclick = e => scroll(e.target.dataset.direction);
  if (customEvent && customEvent.firstArrow)
    wrapper.firstElementChild.onclick = () => customEvent.firstArrow.onClick();
  if (customEvent && customEvent.secondArrow)
    wrapper.lastElementChild.onclick = () => customEvent.secondArrow.onClick();

  return wrapper;
};

export default scrollButtons;
