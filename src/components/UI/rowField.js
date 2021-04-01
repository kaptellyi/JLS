const payloadComp = payload => {
  const payloadEl = document.createElement('small');
  payloadEl.className =
    'transform -translate-y-1 ml-2 text-lg md:text-xl text-pink-400 t-stroke-1 t-stroke-black font-bold';
  payloadEl.innerHTML = payload;

  return payloadEl;
};

const rowFieldComp = (title, description, payload) => {
  const upperCasePattern = /[A-Z]/;
  const match = title.text.match(upperCasePattern);
  const titleText = match
    ? `${title.text.slice(0, match.index)} ${title.text.slice(match.index)}`
    : title.text;
  const descText = Array.isArray(description.text)
    ? description.text.join(', ')
    : description.text;
  const rowFieldEl = document.createElement('article');
  rowFieldEl.className = 'row-field relative leading-10';

  rowFieldEl.innerHTML = `
    <h4 class="title float-left  ${title.className}">${titleText}: </h4>
    <p class="description inline ${description.className}">${descText}</p>
  `;

  if (payload) {
    const payloadEl = payloadComp(payload);
    rowFieldEl.append(payloadEl);
  }

  return rowFieldEl;
};

export default rowFieldComp;
