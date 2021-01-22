import * as types from './types';

let src = {
  isSet: false,
  source: types.GEO_DATA_NAME,
  id: null,
};

let state = {
  hover: false,
};

const setActiveMarker = (cb, id) => {
  const newSource = { ...src, id, isSet: true };
  const newState = { ...state, hover: true };
  src = newSource;
  state = newState;
  cb(newSource, newState);
};

const activateMarker = (cb, id) => {
  if (src.isSet) cb(src, { hover: false });

  const newSource = { ...src, id, isSet: true };
  const newState = { ...state, hover: true };
  src = newSource;
  state = newState;
  cb(newSource, newState);
};

const disActivateMarker = cb => {
  if (src.isSet) cb(src, { hover: false });
  const newSource = { ...src, id: null, isSet: false };
  const newState = { hover: false };
  src = newSource;
  state = newState;
};

const openCords = (l1, l2) =>
  window.open(`https://www.google.com.ua/maps/place/${[l2, l1]}`);

export { setActiveMarker, activateMarker, disActivateMarker, openCords };
