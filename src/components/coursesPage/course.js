import anime from 'animejs/lib/anime.es.js';
import animConfig from '../../shared/animation';
import * as dimensions from '../../shared/dimensions';
import { setPrice } from '../../store/courses';
import { renderCourses } from './coursesPage';
import filter from './filter';
import { saveFilter } from '../../store/filterConfig';
import rowField from '../UI/rowField';

const mobileRes = dimensions.curDimension !== dimensions.X_LARGE;
const coursesPage = document.querySelector('.courses-page');

const filterPointerComp = course => {
  const filterInfoBtn = document.createElement('i');
  filterInfoBtn.className = 'ic ic-xs i-filter-pointer';
  filterInfoBtn.onmouseenter = e => showFilter(e.target, course);
  return filterInfoBtn;
};

const courseNavComp = course => {
  const courseNavEl = document.createElement('div');
  courseNavEl.className =
    'course__nav z-10 absolute w-full flex items-center justify-between px-1 md:px-2';
  courseNavEl.innerHTML = `
    <i class="ic ic md:ic-lg i-see-more"></i>
    <i class="ic ic md:ic-lg i-filter"></i>
  `;

  const seeMoreBtn = courseNavEl.querySelector('.i-see-more');
  const filterBtn = courseNavEl.querySelector('.i-filter');

  seeMoreBtn.onclick = () => {
    const courseEl = document.getElementById(course.id);
    if (courseEl.classList.contains('active')) hideCourseContent(courseEl);
    else showCourseContent(courseEl);
  };
  filterBtn.onclick = () => {
    const courseEl = document.getElementById(course.id);
    const backdropEl = courseEl.querySelector('.backdrop');
    backdropEl.classList.add('active');
  };

  return courseNavEl;
};

const courseInfoComp = course => {
  const courseInfoEl = document.createElement('section');
  courseInfoEl.className = 'course__info w-11/12 pt-20 md:pt-32 opacity-0';

  const titleClass =
    'mr-2 capitalize text-blue-400 text-3xl md:text-4xl xl:text-3xl font-bold t-stroke-1 t-stroke-black';
  const descClass =
    'ml-1 text-pink-400 text-2xl md:text-3xl xl:text-2xl font-bold t-stroke-1 t-stroke-black';
  const infoProps = Object.entries(course.courseInfo);
  infoProps.forEach(prop => {
    const [key, value] = prop;

    if (typeof value === 'object') {
      const { value: val, payload } = value;
      const rowFieldEl = rowField(
        { text: key, className: titleClass },
        { text: val, className: descClass },
        payload
      );
      return courseInfoEl.append(rowFieldEl);
    }

    const rowFieldEl = rowField(
      { text: key, className: titleClass },
      { text: value, className: descClass }
    );
    courseInfoEl.append(rowFieldEl);
  });

  if (!mobileRes) {
    const lastField = courseInfoEl.lastElementChild;
    const lastFiledChildren = lastField.lastElementChild;
    lastFiledChildren.append(filterPointerComp(course));
  }

  return courseInfoEl;
};

const courseBodyComp = course => {
  const courseBodyEl = document.createElement('section');
  courseBodyEl.className =
    'course__body relative h-full w-full flex justify-center';

  courseBodyEl.innerHTML = `
    <header class="course-name absolute centered text-4xl md:text-6xl lg:text-5xl text-pink-400 font-bold t-stroke-1 t-stroke-black text-center">
      <h2>${course.courseName}</h2>
    </header>
  `;
  courseBodyEl.append(courseInfoComp(course));

  return courseBodyEl;
};

const courseComp = course => {
  const courseEl = document.createElement('div');
  courseEl.id = course.id;
  courseEl.className = 'course relative h-screen w-full';
  if (course.active) courseEl.classList.add('active');
  courseEl.innerHTML =
    '<article class="course-bg h-full w-full bg-cover bg-center bg-no-repeat absolute"></article>';

  if (mobileRes) {
    courseEl.append(courseNavComp(course));
    courseEl.append(filter(course));
  }
  courseEl.append(courseBodyComp(course));

  return courseEl;
};

export default courseComp;

// Animation
const liftCourseName = (courseEl, direction) => {
  anime({
    targets: courseEl.querySelector('.course-name'),
    ...animConfig,
    direction,
    translateY: ['-50%', `-${window.innerHeight / 2}px`],
    translateX: ['-50%', '-50%'],
    begin: () =>
      courseEl
        .querySelector('.course-name')
        .classList.add(dimensions.curDimension.toLowerCase()),
  });
};

// Events
const showCourseContent = courseEl => {
  courseEl.classList.add('active');
  anime
    .timeline({
      ...animConfig,
    })
    .add({
      begin: () => liftCourseName(courseEl, 'normal'),
    })
    .add({
      targets: courseEl.querySelector('.course__info'),
      ...animConfig,
      opacity: 1,
      duration: 100,
    });
};

const hideCourseContent = courseEl => {
  courseEl.classList.remove('active');
  anime(showCourseContent);
  anime({
    begin: () => {
      liftCourseName(courseEl, 'reverse');
      anime({
        targets: courseEl.querySelector('.course__info'),
        ...animConfig,
        opacity: 0,
        duration: 0,
      });
    },
  });
};

const getFilterPos = (target, courseEl, filterEl) => {
  const courseEls = document
    .querySelector('.courses-wrapper')
    .querySelectorAll('.course');
  const activeIndex = Array.from(courseEls).findIndex(
    c => c.id.toLowerCase() === courseEl.id.toLowerCase()
  );
  const coursePosEnd = courseEl.clientWidth * activeIndex + 1;
  const halfPadding = (courseEl.clientWidth - filterEl.clientWidth) / 2;
  const { y } = target.getBoundingClientRect();
  return { x: coursePosEnd + halfPadding, y: y + 50 };
};

const showFilter = (target, course) => {
  const courseEl = document.getElementById(course.id);
  const filterEl = filter(course);
  courseEl.classList.add('filter-active');
  coursesPage.append(filterEl);
  const { x, y } = getFilterPos(target, courseEl, filterEl);
  filterEl.style.transform = `translate(${x}px, ${y}px)`;

  let removeTimeout;
  target.onmouseleave = () => {
    const removeFilterEl = setTimeout(() => {
      courseEl.classList.remove('filter-active');
      filterEl.remove();
    }, 300);
    removeTimeout = removeFilterEl;
  };
  filterEl.onmouseenter = () => clearTimeout(removeTimeout);
  filterEl.onmouseleave = () => {
    const cb = config => setPrice(renderCourses, course, config);
    saveFilter(cb, course, filterEl);
    courseEl.classList.remove('filter-active');
    filterEl.remove();
  };
};
