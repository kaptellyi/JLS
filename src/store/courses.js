import { getDefaultConfig } from './filterConfig';
import * as types from './types';

// State
let courses = [
  {
    courseName: 'Short Term Course',
    courseType: types.SHORT,
    courseInfo: {
      period: '2 weeks - 6 months',
      enrollment: 'Summer',
      levels: 'N5, N4, N3',
      classes: '10:00 - 12:00 / 13:00 - 15:00',
      price: {
        value: 0,
        payload: null,
      },
    },
    id: 'course-0',
  },

  {
    courseName: 'Long Term Course',
    courseType: types.LONG,
    courseInfo: {
      period: '2 months - 2 years',
      enrollment: 'Summer, Autumn',
      levels: 'N5, N4, N3, N2, N1',
      classes: '9:00 - 11:00 / 12:00 - 14:00',
      price: {
        value: 0,
        payload: null,
      },
    },
    id: 'course-1',
  },

  {
    courseName: 'Evening Course',
    courseType: types.EVENING,
    courseInfo: {
      period: '2 months - 1 year',
      enrollment: 'Summer',
      levels: 'N5, N4, N3, N2',
      classes: '15:00 - 17:00 / 18:00 - 20:00',
      price: {
        value: 0,
        payload: null,
      },
    },
    id: 'course-2',
  },
];

// Short-term, USD, Tokyo, Two Weeks
const defaultPrice = 100;

const priceMultipliers = {
  city: [
    {
      name: types.TOKYO,
      multiplier: 1.3,
    },
    {
      name: types.NAGOYA,
      multiplier: 0.8,
    },
    {
      name: types.KYOTO,
      multiplier: 0.6,
    },
  ],

  period: [
    {
      name: types.TWO_WEEKS,
      multiplier: 1,
    },
    {
      name: types.MONTH,
      multiplier: 2.5,
    },
    {
      name: types.TWO_MONTHS,
      multiplier: 5,
    },
    {
      name: types.FOUR_MONTHS,
      multiplier: 10,
    },
    {
      name: types.SIX_MONTHS,
      multiplier: 15,
    },
    {
      name: types.ONE_YEAR,
      multiplier: 30,
    },
    {
      name: types.TWO_YEARS,
      multiplier: 60,
    },
  ],
};

let tryToGetApi = 0;

// Logic
const getMultipliedPrice = (price, multipliers, value) => {
  if (!multipliers) return price;
  const item = multipliers.find(m => m.name === value);
  return item.multiplier * price;
};

const getNewPrice = (config, defPrice) => {
  const keys = Object.keys(config);
  const values = Object.values(config);

  const newPrice = keys.reduce(
    (price, key, i) =>
      getMultipliedPrice(price, priceMultipliers[key], values[i]),
    defPrice
  );
  return newPrice;
};

const convertMoney = async (money, currency) => {
  if (getDefaultConfig().currency === currency) return money;
  const result = await fetch('https://api.exchangeratesapi.io/latest');
  const response = await result.json();
  const { rates } = response;
  return rates[currency] ? money * rates[currency] : money;
};

const updateCourses = (cb, oldCourses, newCourse) => {
  const newCourses = oldCourses.map(c =>
    c.id === newCourse.id ? newCourse : c
  );
  courses = newCourses;
  cb(courses);
};

const updateCourse = (course, config, price) => {
  const { courseInfo } = course;
  const payload = `${config.currency} per ${config.period
    .toLowerCase()
    .split('_')
    .join(' ')} (${config.city[0] + config.city.toLowerCase().slice(1)})`;
  const newCourseInfo = {
    ...courseInfo,
    price: { value: price.toFixed(0), payload },
  };
  const newCourse = { ...course, courseInfo: newCourseInfo, config };
  return newCourse;
};

// Reducers
const setCourses = (cb, state) => {
  let error;
  try {
    types.getFilterTypes(types.CURRENCY);
  } catch (err) {
    if (tryToGetApi === 10) throw Error("currency API doesn't respond");
    error = new Error(err);
  }
  if (error instanceof Error)
    return setTimeout(() => {
      tryToGetApi++;
      setCourses(cb, state);
    }, 300);

  const newCourses = state.map(c => {
    const { course, config } = c;
    const newPrice = getNewPrice(config, defaultPrice);
    const updatedCourse = updateCourse(course, config, newPrice);
    return updatedCourse;
  });

  courses = newCourses;
  cb(courses);
};

const setPrice = async (cb, course, config) => {
  const newPrice = getNewPrice(config, defaultPrice);
  const convertedPrice = await convertMoney(newPrice, config.currency);
  const newCourse = updateCourse(course, config, convertedPrice);
  updateCourses(cb, courses, newCourse);
};

export { courses, setCourses, setPrice };
