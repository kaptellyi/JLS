let carouselItems = [];

const getCarouselItems = () => carouselItems;
const setItems = items => (carouselItems = items);

const updateItems = (cb, newItems) => {
  carouselItems = newItems;
  cb(carouselItems);
};

const changeItem = cb => {
  const last = carouselItems.length - 1;
  const newItems = [carouselItems[last]]
    .concat(carouselItems.slice(0, last))
    .map((c, i) => ({ ...c, active: i === 0 }));
  updateItems(cb, newItems);
};

export default carouselItems;
export { setItems, updateItems, changeItem, getCarouselItems };
