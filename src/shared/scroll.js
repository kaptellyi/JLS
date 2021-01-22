import throttle from './throttle'

const scroll = direction => {
  const curPos = window.scrollY;
  const newPosition =
    direction === 'down'
      ? curPos + window.innerHeight
      : curPos - window.innerHeight;
  window.scrollTo({
    top: newPosition,
    behavior: 'smooth',
  });
};

export default throttle(scroll, 250);
