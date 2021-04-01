// FilterTypes
export const CURRENCY = 'CURRENCY';
export const CITY = 'CITY';
export const PERIOD = 'PERIOD';

// Cities
export const TOKYO = 'TOKYO';
export const NAGOYA = 'NAGOYA';
export const KYOTO = 'KYOTO';

// Period
export const TWO_WEEKS = 'TWO_WEEKS';
export const MONTH = 'MONTH';
export const TWO_MONTHS = 'TWO_MONTHS';
export const FOUR_MONTHS = 'FOUR_MONTHS';
export const SIX_MONTHS = 'SIX_MONTHS';
export const TWO_YEARS = 'TWO_YEARS';
export const ONE_YEAR = 'ONE_YEAR';

// Courses
export const SHORT = 'SHORT';
export const LONG = 'LONG';
export const EVENING = 'EVENING';

// Types objects
const currencyTypes = {};
const setCurrencyTypes = async () => {
  const result = await fetch(
    // 'https://api.exchangeratesapi.io/v1/latest?access_key=c6d20c863cfc928b915fa75fdf987257&format=1'
    'https://v6.exchangerate-api.com/v6/01624665d0907ef38e7f61f7/latest/USD'
  );
  const response = await result.json();
  const { conversion_rates } = response;
  Object.keys(conversion_rates).forEach(rate => (currencyTypes[rate] = rate));
};
setCurrencyTypes();

const cityTypes = {
  TOKYO,
  NAGOYA,
  KYOTO,
};

const periodTypes = {
  TWO_WEEKS,
  MONTH,
  TWO_MONTHS,
  FOUR_MONTHS,
  SIX_MONTHS,
  ONE_YEAR,
  TWO_YEARS,
};

export const getFilterTypes = type => {
  switch (type.toUpperCase()) {
    case CURRENCY:
      if (Object.keys(currencyTypes).length === 0)
        throw Error('no currency types');
      return currencyTypes;
    case CITY:
      return cityTypes;
    case PERIOD:
      return periodTypes;
    default:
      throw Error('no such filter type');
  }
};

// Map
export const GEO_DATA_NAME = 'CITIES';
export const CITIES_LAYER_NAME = 'CITIES_LAYER';

// Promo
export const FIRST_STAGE = 'FIRST_STAGE';
export const SECOND_STAGE = 'SECOND_STAGE';
export const THIRD_STAGE = 'THIRD_STAGE';
