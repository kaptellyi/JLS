export const XS_SMALL = 'XS_SMALL';
export const SMALL = 'SMALL';
export const MEDIUM = 'MEDIUM';
export const LARGE = 'LARGE';
export const X_LARGE = 'X_LARGE';

const XS_SMALL_SIZE = 340;
const SMALL_SIZE = 640;
const MEDIUM_SIZE = 768;
const LARGE_SIZE = 1024;
const X_LARGE_SIZE = 1280;

const getCurDimension = () => {
  const curDimension = window.innerWidth;
  if (curDimension <= XS_SMALL_SIZE) return XS_SMALL;
  if (curDimension <= SMALL_SIZE) return SMALL;
  if (curDimension <= MEDIUM_SIZE) return MEDIUM;
  if (curDimension <= LARGE_SIZE) return LARGE;
  return X_LARGE;
};

export const curDimension = getCurDimension();
