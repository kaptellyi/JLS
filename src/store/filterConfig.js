import * as types from './types';

const initialConfig = {
  currency: 'USD',
  city: types.TOKYO,
  period: types.TWO_WEEKS,
};

const defaultPeriods = {
  [types.SHORT]: types.TWO_WEEKS,
  [types.LONG]: types.TWO_MONTHS,
  [types.EVENING]: types.TWO_MONTHS,
};

// Logic
const validateField = (key, value) => {
  const possibleValues = Object.values(types.getFilterTypes(key.toUpperCase()));
  const match = possibleValues.findIndex(v => v === value.toUpperCase());
  return match >= 0;
};

// Reducers
const getDefaultConfig = type => {
  switch (type) {
    case types.SHORT:
      return { ...initialConfig, period: defaultPeriods[type] };
    case types.LONG:
      return { ...initialConfig, period: defaultPeriods[type] };
    case types.EVENING:
      return { ...initialConfig, period: defaultPeriods[type] };
    default:
      return { ...initialConfig, period: null };
  }
};

const changeConfig = (cb, oldConfig, newConfig) => {
  const config = { ...oldConfig, ...newConfig };
  cb(config);
};

const saveFilter = (cb, course, filterEl) => {
  const newConfig = {};
  const filterKeys = Object.keys(initialConfig);
  const inputEls = filterEl.querySelectorAll('input');
  filterKeys.forEach((k, i) => {
    const { value } = inputEls[i];
    const val = value.toUpperCase().split(' ').join('_');
    if (!value || !validateField(k, val)) return;
    newConfig[k] = val;
  });
  if (Object.keys(newConfig).length === 0) return;
  changeConfig(cb, course.config, newConfig);
};

export { initialConfig, getDefaultConfig, saveFilter };
