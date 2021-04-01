import '../../assets/styles/cards-page/cards-page.css';
import animateCarousel from './animation';
import cards, {
  cardShift,
  lineBreak,
  setCards,
  adjustReviewComment,
} from '../../store/cards';
import * as dimensions from '../../shared/dimensions';
import rowField from '../UI/rowField';
import carousel from '../carousel/carousel';
import { getCarouselItems, setItems } from '../../store/carousel';
import backdrop from '../UI/backdrop';
import scrollButtons from '../UI/scrollButtons';

const imgPattern = name => new RegExp(`${name}.(png|jpe?g|webp)$`);
const importAll = data => data.keys().map(data);

const teachersImages = importAll(
  require.context(
    '../../assets/img/cards/teachers',
    false,
    /\.(png|jpe?g|svg|webp)$/
  )
);

const studentImages = importAll(
  require.context(
    '../../assets/img/cards/students',
    false,
    /\.(png|jpe?g|svg|webp)$/
  )
);

const mobResolution = dimensions.curDimension !== dimensions.X_LARGE;

const cardsPage = document.querySelector('.cards-page');

const customScrollLEvent = {
  secondArrow: {
    onClick: () => {
      import(
        /* webpackChunkName: "courseIntoPage" */
        '@src/components/parallaxPages/courseIntroPage/courseIntroPage'
      );
      import(
        /* webpackChunkName: "contactPage" */
        '@src/components/parallaxPages/contactPage/contactPage'
      );
      if (!mobResolution)
        import(
          /* webpackChunkName: "promoSun" */
          '@src/components/parallaxPages/stickyPromoSun'
        );
    },
  },
};

// Logic
const editComment = (comment, isOverflowed, toExpand) => {
  const splittedComment = comment.split(' ');
  const expandBtn = document.createElement('i');
  expandBtn.className = 'expand-btn';

  const cutLastLine = isOverflowed && toExpand ? 2 : 0;
  const adjustedFirstLine = `${splittedComment
    .slice(0, lineBreak)
    .join(' ')}</br>`;
  const adjustedWords = splittedComment
    .slice(lineBreak, splittedComment.length - cutLastLine)
    .join(' ');
  const adjustedComment = `${adjustedFirstLine}${adjustedWords}`;

  return toExpand
    ? `${adjustedComment} ${expandBtn.outerHTML}`
    : adjustedComment;
};

// Components
const cardPreviewComp = card => {
  const cardPreviewEl = document.createElement('section');
  cardPreviewEl.className =
    'card__preview text-right font-bold absolute right-0 m-1';
  cardPreviewEl.innerHTML = `
    <h4 class="text-lg md:text-3xl">${card.description.name}</h4>
    <p id="expand-card" class="text-md md:text-2xl leading-4 text-grayish">Learn more</p>
  `;

  cardPreviewEl.onclick = () => popupCard(card);

  return cardPreviewEl;
};

// Header
const cardHeaderComp = (card, withPreview) => {
  const cardHeaderEl = document.createElement('section');
  cardHeaderEl.className =
    'card__header relative h-full w-full bg-cover bg-no-repeat bg-center';

  // const imgFormatPattern = /\.(png|jpe?g|webp)$/;
  const imgPath = teachersImages.find(tImg =>
    tImg.default.match(imgPattern(card.description.img))
  );
  const imgEl = document.createElement('img');
  imgEl.className =
    'teacher absolute h-20 w-20 md:h-24 w-20 md:w-24 xl:h-16 xl:w-16 border-3 border-pink-400 rounded-full object-cover';
  imgEl.src = imgPath.default;
  if (!withPreview) cardHeaderEl.append(cardPreviewComp(card));
  cardHeaderEl.append(imgEl);

  return cardHeaderEl;
};

// Body
const cardDescComp = card => {
  const cardDescriptionEl = document.createElement('section');
  cardDescriptionEl.className =
    'card__description px-2 overflow-hidden transition-all duration-300';

  const descProps = Object.entries(card.description);
  const titleClassName =
    'capitalize text-pink-400 font-bold text-2xl t-stroke-1 t-stroke-black mr-2';
  const descClassName = 'font-bold text-xl leading-7';
  descProps.forEach(prop => {
    const [key, value] = prop;
    if (key === 'img') return;
    const fieldEl = rowField(
      { text: key, className: titleClassName },
      { text: value, className: descClassName }
    );
    cardDescriptionEl.append(fieldEl);
  });

  return cardDescriptionEl;
};

const cardReviewComp = card => {
  const cardReviewEl = document.createElement('section');
  const { initial, adjusted } = card.review.comment;
  const comment = adjusted
    ? editComment(adjusted, true, true)
    : editComment(initial, false, false);
  cardReviewEl.className = 'review card__review w-full flex flex-col bg-white';
  cardReviewEl.innerHTML = `
    <section class="review__top wrapper-border p-4 mt-1 w-full flex justify-center">
      <section class="review-teacher w-48 h-12 shadow-lg flex items-center">
        <img class="avatar object-cover rounded-full border-3 border-pink-400 shadow-lg"></img>
        <h4 class="review-author capitalize font-bold text-xl ml-1">${card.review.author}</h4>
      </section>
    </section>

    <section class="review__body text-centered h-full relative py-2 px-2 overflow-hidden flex justify-center items-center">
      <i class="absolute top-0 left-0 ml-1 text-3xl text-pink-400 font-bold t-stroke-1 t-stroke-black">“</i>
      <p class="review-comment w-full h-full relative text-md font-bold text-justify">${comment}</p>
      <i class="absolute top-0 right-0 mr-1 text-3xl text-pink-400 font-bold t-stroke-1 t-stroke-black">“</i>
    </section>
  `;

  const { default: imgPath } = studentImages.find(tImg =>
    tImg.default.match(imgPattern(card.review.img))
  );
  cardReviewEl.querySelector('.avatar').src = imgPath;

  return cardReviewEl;
};

const cardBodyComp = card => {
  const cardBodyEl = document.createElement('section');
  cardBodyEl.className = `card__body h-full pt-10 transition-all duration-300 ease-in-out`;
  cardBodyEl.append(cardDescComp(card));
  const cardReviewEl = cardReviewComp(card);
  cardBodyEl.append(cardReviewEl);

  return cardBodyEl;
};

// Card
const cardComp = (card, index = 0, isPopup) => {
  const cardEl = document.createElement('article');
  const translate = shift =>
    mobResolution
      ? `translateY(-${shift * index}em)`
      : `translateX(${shift * index}em)`;
  if (!isPopup) {
    cardEl.style.zIndex = -index;
    cardEl.style.transform = translate(cardShift);
  }
  cardEl.id = card.id;
  const flexibleClasses =
    mobResolution && !isPopup ? 'card_small-card' : 'card_large-card';
  cardEl.className = `card ${flexibleClasses} absolute h-full w-full border-b-6 border-pink-400 bg-white pointer-events-none`;
  if (card.active) cardEl.classList.add('active');
  cardEl.append(cardHeaderComp(card, !mobResolution || isPopup));

  if (!mobResolution || isPopup) {
    cardEl.append(cardBodyComp(card));
    const expandBtn = cardEl.querySelector('.expand-btn');
    if (expandBtn) expandBtn.onclick = e => onExpand(e, card, cardEl);
  }

  return cardEl;
};

// Events
const onExpand = (e, card, cardEl) => {
  e.stopPropagation();
  const reviewCommentEl = cardEl.querySelector('.review-comment');
  const { initial, adjusted } = card.review.comment;
  reviewCommentEl.innerHTML = cardEl.classList.contains('expanded')
    ? editComment(adjusted, true, true)
    : editComment(initial, false, true);
  const expandBtnEl = reviewCommentEl.querySelector('.expand-btn');
  expandBtnEl.onclick = e => onExpand(e, card, cardEl);

  cardEl.classList.toggle('expanded');
};

const popupCard = () => {
  const card = getCarouselItems()[0];
  const cardEl = cardComp(card, 0, true);

  document.body.append(cardEl);
  cardEl.dataset.cutSize = 10;
  const adjustedCard = adjustReviewComment(card, cardEl);
  const adjustedCardEl = cardComp(adjustedCard, 0, true);

  adjustedCardEl.id = 'popup-card';
  adjustedCardEl.className += ' card_large-card';

  cardsPage.append(backdrop(adjustedCardEl, false));
};

// Init
const classes = {
  carousel:
    'h-48 md:h-1/4 xl:h-9/12 absolute centered w-full md:w-11/12 xl:w-1/4',
  switchersWrapper:
    'right-0 bottom-0 xl:right-auto xl:left-1/2 xl:-bottom-10 transform xl:-translate-x-1/2 my-3 mx-1 flex z-50',
};
const customEvents = {
  container: cardsPage,
  onClickHandler: (cb, items) => animateCarousel(cb, items),
};

const cardEls = cards.map((c, i) => cardComp(c, i));
setCards(setItems, classes.carousel, cardEls);
const carouselEl = carousel(classes, cardComp, customEvents);
cardsPage.append(carouselEl);
cardsPage.append(scrollButtons(customScrollLEvent));
