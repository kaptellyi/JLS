import * as types from './types';

const initialState = {
  stage: types.SECOND_STAGE,
  width: 0,
  x: 0,
  y: 0,
  scale: 1.4,
};

const getState = () => initialState;

export { getState };
