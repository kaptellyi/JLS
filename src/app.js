// Main
import(
  /* webpackPreload: true */
  /* webpackChunkName: "tailwind" */
  './assets/styles/tailwind.css'
);
import(
  /* webpackPreload: true */
  /* webpackChunkName: "base" */
  './assets/styles/base.css'
);

// Critical
import(
  /* webpackPreload: true */
  /* webpackChunkName: "startPage" */
  './components/startPage/startPage'
);

// Shared
import(
  /* webpackPreload: true */
  /* webpackChunkName: "shared" */
  './assets/styles/shared/index'
);

// Courses Page
import(
  /* webpackPreload: true */
  /* webpackChunkName: "coursePage" */
  './components/coursesPage/coursesPage'
);

window.addEventListener('load', () => document.body.removeAttribute('style'));
