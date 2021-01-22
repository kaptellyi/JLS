import '@styles/courses/filter.css';
import * as dimensions from '../../shared/dimensions';
import * as types from '../../store/types';
import { setPrice } from '../../store/courses';
import { renderCourses } from './coursesPage';
import { saveFilter } from '../../store/filterConfig';
import backdrop from '../UI/backdrop';

// Components
const filterFieldComp = (key, course) => {
  const fieldEl = document.createElement('div');
  fieldEl.className = 'filter__field w-full flex justify-center items-end';
  fieldEl.innerHTML = `
    <i class="ic ic-sm md:ic xl:ic-sm i-${key}"></i>
    <div class="filter__input-form ml-1 lowercase relative text-xl md:text-4xl xl:text-2xl">
      <h4 class="filter-title absolute bottom-0 capitalize font-bold text-pink-400 text-xl md:text-4xl xl:text-2xl transition-all duration-200 ease-out t-stroke-1 t-stroke-black">${key}</h4>
      <input class="outline-none lowercase border-b-2 border-black text-xl md:text-4xl xl:text-2xl  text-black" type="text" />
    </div>
  `;

  const inputEl = fieldEl.querySelector('input');
  fieldEl.onclick = () => selectInput(fieldEl);
  inputEl.oninput = e => showMatch(e, fieldEl, course);
  inputEl.onfocus = () => activateInput(fieldEl);
  inputEl.onblur = () => clearMatches(fieldEl);

  return fieldEl;
};

const filterComp = course => {
  const filterEl = document.createElement('div');
  filterEl.className =
    'filter absolute bottom-0 left-0  xl:top-0 xl:bottom-auto p-4 md:p-8 xl:p-6 w-full xl:w-auto flex justify-center items-center border-2 border-pink-400 bg-white';
  filterEl.innerHTML = `
    <div class="filter__inner w-full flex flex-col justify-center items-center space-y-4 md:space-y-8 xl:space-y-4">
        
    </div>
  `;

  const filterKeys = Object.keys(course.config);
  filterKeys.forEach(k => {
    const filterFieldEl = filterFieldComp(k, course);
    const filterInnerEl = filterEl.querySelector('.filter__inner');
    filterInnerEl.append(filterFieldEl);
  });

  filterEl.onclick = e => e.stopPropagation();

  const cb = config => setPrice(renderCourses, course, config);
  const customEvent = {
    name: 'saveFilter',
    handler: () => saveFilter(cb, course, filterEl),
  };

  return dimensions.curDimension === dimensions.X_LARGE
    ? filterEl
    : backdrop(filterEl, true, customEvent);
};

export default filterComp;

// Logic
const getBlacklist = type => {
  switch (type) {
    case types.SHORT:
      return [types.ONE_YEAR, types.TWO_YEARS];
    case types.LONG:
      return [types.TWO_WEEKS];
    case types.EVENING:
      return [types.TWO_WEEKS, types.TWO_YEARS];
    default:
      throw Error('no such a course type');
  }
};

const filterMatches = (filterType, courseType) => {
  const type = types.getFilterTypes(filterType);
  const filterTypes = typeof type === 'function' ? type() : type;
  let matches = Object.keys(filterTypes);
  const blackList = getBlacklist(courseType);
  matches = matches.filter(
    m => m !== blackList.find(w => m.toLowerCase() === w.toLowerCase())
  );

  matches = matches.map(key =>
    key.includes('_') ? key.split('_').join(' ') : key
  );

  return matches;
};

const findMatch = (value, filterType, courseType) => {
  const matches = filterMatches(filterType, courseType);
  const match = matches.find(m => {
    const index = m.toLowerCase().indexOf(value.toLowerCase());
    return index === 0 ? m : null;
  });
  return match ? match.toLowerCase() : '';
};

// Events
const selectInput = fieldEl => {
  const inputEl = fieldEl.querySelector('input');
  inputEl.focus();
};

const activateInput = fieldEl => {
  const inputFormEl = fieldEl.querySelector('.filter__input-form');
  inputFormEl.classList.add('active');
};

const clearMatches = fieldEl => {
  const inputFormEl = fieldEl.querySelector('.filter__input-form');
  const inputEl = fieldEl.querySelector('input');
  if (inputEl.value.trim().length === 0) {
    inputFormEl.classList.remove('active');
    inputFormEl.removeAttribute('data-autocomplete');
  } else inputFormEl.dataset.autocomplete = '';
};

const showMatch = (e, fieldEl, course) => {
  const inputEl = fieldEl.querySelector('input');
  if (inputEl.value.trim().length === 0 && e.data === ' ') inputEl.value = '';
  const inputFormEl = fieldEl.querySelector('.filter__input-form');
  const curFilterCol = inputFormEl.innerText;
  const inputValue = inputEl.value.trim();
  if (inputValue.length <= 1) return (inputFormEl.dataset.autocomplete = '');

  const match = findMatch(inputValue, curFilterCol, course.courseType);
  inputFormEl.dataset.autocomplete = match;
};
