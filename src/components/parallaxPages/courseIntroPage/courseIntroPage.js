import '@styles/parallax-pages/course-introduction.css';
import * as dimensions from '../../../shared/dimensions';
import promoBtn from '../../UI/promoBtn';
import scroll from '../../../shared/scroll';
import createPromoText from '../../UI/promoText';

const mobRes = dimensions.curDimension !== dimensions.X_LARGE;

const promoText = {
  xsRes: ['do', 'you', 'wanna', 'join our', 'school?'],
  smRes: ['do', 'you', 'wanna', 'join our school?'],
  xlRes: [
    'do you wanna join our classes?',
    'get a free consultation right now!',
  ],
};

let curPromoText;
if (dimensions.curDimension === dimensions.XS_SMALL)
  curPromoText = promoText.xsRes;
else if (mobRes) curPromoText = promoText.smRes;
else curPromoText = promoText.xlRes;

const promoTextStyles = {
  mainNode: 't-stroke-pink',
  wrapperStyles: {},
  cloneStyles: [
    { color: '#1B2473' },
    { color: '#FFCEE3' },
    { color: '#FEAACD' },
  ],
};

const promoTextConfig = {
  num: 2,
  shift: 0.15,
};

const courseIntroPage = document.querySelector(
  '.promo-page_course-introduction'
);

const promoTextEl = courseIntroPage.querySelector('.promo-text');
const promoTexts = createPromoText(
  curPromoText,
  promoTextConfig,
  promoTextStyles
);
promoTexts.forEach((el, i) => {
  if (mobRes) el.style.transform = `translateX(${i * 0.5}em)`;
  promoTextEl.append(el);
});
promoTexts.forEach(el => promoTextEl.append(el));

const btnConfig = {
  num: 1,
  shift: 0.3,
  customEvents: {
    onClick: () => {
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "contactPage" */
        '@src/components/parallaxPages/contactPage/contactPage'
      );
      scroll('down');
    },
  },
};

const promoInfoEl = courseIntroPage.querySelector('.promo__info');
const promoBtnEl = promoBtn('YES!', btnConfig);
promoInfoEl.append(promoBtnEl);
