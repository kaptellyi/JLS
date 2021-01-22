import '@styles/courses/courses.css';
import * as dimensions from '../../shared/dimensions';
import { courses, setCourses } from '../../store/courses';
import course from './course';
import { getDefaultConfig } from '../../store/filterConfig';
import scrollButtons from '../UI/scrollButtons';
import { resumePetalsLevitation } from '../startPage/startPage';

const mobileRes = dimensions.curDimension !== dimensions.X_LARGE;
const coursesPage = document.querySelector('.courses-page');
const coursesWrapperEl = coursesPage.querySelector('.courses-wrapper');

const customScrollLEvent = {
  firstArrow: {
    onClick: () => resumePetalsLevitation(),
  },
  secondArrow: {
    onClick: () => {
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "mapPage" */
        '@styles/parallax-pages/main.css'
      );
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "mapPage" */
        '@src/components/parallaxPages/mapPage/mapPage'
      );
    },
  },
};

const renderCourses = courses => {
  coursesWrapperEl.innerHTML = '';
  courses.forEach((c, i) => {
    const courseEl = course(c, mobileRes);
    if (mobileRes && i === 0)
      courseEl.append(scrollButtons(customScrollLEvent));
    else if (mobileRes) courseEl.append(scrollButtons());
    coursesWrapperEl.append(courseEl);
  });
  if (!mobileRes) {
    const scrollButtonsEl = scrollButtons(customScrollLEvent);
    coursesPage.append(scrollButtonsEl);
  }
};

export { renderCourses };

const state = courses.map(c => ({
  course: c,
  config: getDefaultConfig(c.courseType),
}));
setCourses(renderCourses, state);
