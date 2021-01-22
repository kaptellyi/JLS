// State
import * as dimensions from '../shared/dimensions';

const mobRes = dimensions.curDimension !== dimensions.X_LARGE;

let cards = [
  {
    description: {
      name: 'Kasaka Rinada',
      age: 45,
      workExperience: 12,
      languages: ['japanese', 'chinese', 'english'],
      img: 'teacher-1',
    },
    review: {
      author: 'Reina',
      comment: {
        initial:
          'That was a pleasure to be taught by Kasaka Rinada. She is like a psychologist which knows the right way to approach you!',
        adjusted: null,
      },
      img: 'student-1',
    },
    active: true,
    id: 'card-0',
  },
  {
    description: {
      name: 'Mikoto Tsukai',
      age: 54,
      workExperience: 30,
      languages: ['japanese', 'chinese', 'english', 'korean'],
      img: 'teacher-2',
    },
    review: {
      author: 'John',
      comment: {
        initial:
          'Mikoto Tsukai is a real professional. The way she explains things is amazing. I think every kid is capable to understand every tough topic with her. Very meaningful information in easy words.',
        adjusted: null,
      },
      img: 'student-2',
    },
    id: 'card-1',
  },
  {
    description: {
      name: 'Azuki Kuzarai',
      age: 32,
      workExperience: 11,
      languages: ['japanese', 'english'],
      img: 'teacher-3',
    },
    review: {
      author: 'Max',
      comment: {
        initial:
          "Azuki Kuzarai is a very kinda person with a warm heart and creative brain. She could come up with a very interesting analogy to any words. Thanks to her I've acquired a rich vocabulary",
        adjusted: null,
      },
      img: 'student-3',
    },
    id: 'card-2',
  },
];

const cardShift = 2;
const lineBreak = mobRes ? 3 : 6;

// Logic
const getAdjustedComment = (comment, reviewEl, cutSize) => {
  const dividedWidth = (reviewEl.clientWidth * cutSize) / 100;
  const dividedHeight = (reviewEl.clientHeight * cutSize) / 100;
  const newWidth = Math.ceil(reviewEl.clientWidth - dividedWidth);
  const newHeight = Math.ceil(reviewEl.clientHeight - dividedHeight);
  const reviewWords = comment.initial.split(' ');

  const counterEl = document.createElement('div');
  const paragraph = document.createElement('p');
  counterEl.append(paragraph);
  counterEl.id = 'counter';
  counterEl.className = `absolute text-centered ${reviewEl.className}`;
  counterEl.style.width = `${newWidth}px`;
  document.body.append(counterEl);

  let words = '';
  let isOverflowed = false;
  for (let i = 0; i < reviewWords.length; i++) {
    if (i === lineBreak) paragraph.innerHTML = paragraph.innerHTML += '<br/>';
    const w = reviewWords[i];
    paragraph.innerHTML = `${paragraph.innerHTML} ${w}`;
    if (counterEl.clientHeight <= newHeight) words += `${w} `;
    else {
      isOverflowed = true;
      break;
    }
  }
  counterEl.remove();

  return { words, isOverflowed };
};

const adjustReviewComment = (card, cardEl) => {
  const cutSize = cardEl.dataset.cutSize || 0;
  const reviewComment = card.review.comment;
  const reviewCommentEl = cardEl.querySelector('.review-comment');
  if (!reviewCommentEl) return card;

  const { words, isOverflowed } = getAdjustedComment(
    reviewComment,
    reviewCommentEl,
    cutSize
  );
  if (!isOverflowed) {
    cardEl.remove();
    return card;
  }
  const newReviewComment = { ...reviewComment, adjusted: words };
  const newReview = { ...card.review, comment: newReviewComment };
  cardEl.remove();
  return { ...card, review: newReview };
};

// Routers
const setCards = (cb, containerClasses, cardEls) => {
  const containerEl = document.createElement('div');
  containerEl.className = containerClasses;
  cardEls.forEach(el => containerEl.append(el));
  document.querySelector('.cards-page').append(containerEl);

  const newCards = cards.map((c, i) => adjustReviewComment(c, cardEls[i]));
  cards = newCards;
  containerEl.remove();

  cb(cards);
};

export default cards;
export { cardShift, lineBreak, setCards, adjustReviewComment };
