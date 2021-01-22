import '@styles/parallax-pages/contact-page.css';
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';
import Inputmask from 'inputmask';
import * as dimensions from '../../../shared/dimensions';
import debounce from '../../../shared/debounce';
import createPromoText from '../../UI/promoText';
import promoBtn from '../../UI/promoBtn';
import backdrop from '../../UI/backdrop';

const mobRes = dimensions.curDimension !== dimensions.X_LARGE;

const promoText = {
  smRes: ['get', 'free and fast', 'consultation', 'right now!'],
  lgRes: ['Enter your phone number and we will contact you soon!'],
};

const curPromoText = mobRes ? promoText.smRes : promoText.lgRes;

const promoTextStyles = {
  mainNode: 't-stroke-pink',
  wrapperStyles: {
    [promoText.smRes.length - 2]: {
      textAlign: 'left',
    },
    [promoText.smRes.length - 1]: {
      textAlign: 'left',
    },
  },
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

const contactPageEl = document.querySelector('.promo-page_contact');
const promoTextEl = contactPageEl.querySelector('.promo-text');
const contactFormEl = contactPageEl.querySelector('.promo__contact-form');
const contactLinkEls = contactPageEl.querySelectorAll('.promo__link');

// Promo Text
const promoTexts = createPromoText(
  curPromoText,
  promoTextConfig,
  promoTextStyles
);

promoTexts.forEach((el, i) => {
  if (mobRes) {
    const mathSign = i >= promoText.smRes.length / 2 ? '' : '-';
    el.style.transform = `translateX(${mathSign}${i * 1}em)`;
  }
  promoTextEl.append(el);
});
promoTexts.forEach(el => promoTextEl.append(el));

// Links
Array.from(contactLinkEls).forEach(el => {
  el.onclick = () => window.open(el.dataset.url);
});

// Modal
const getRandomQuote = async () => {
  const request = await fetch('https://type.fit/api/quotes');
  const response = await request.json();
  const random = (Math.random() * response.length).toFixed(0);
  const randomQuote = response[random];
  return randomQuote;
};

const showContactModal = async () => {
  const contactModalEL = document
    .getElementById('contact-modal-temp')
    .content.cloneNode(true).firstElementChild;
  const closeModalEl = contactModalEL.querySelector('.ic-close');
  const modalQuoteEl = contactModalEL.querySelector('.contact-modal-quote');
  const modalAuthorEl = contactModalEL.querySelector('.contact-modal-author');
  const { text, author } = await getRandomQuote();
  const withBackdropEl = backdrop(contactModalEL, false);

  modalQuoteEl.innerText = text;
  modalAuthorEl.innerText = author || 'unknown author';

  closeModalEl.onclick = () => withBackdropEl.remove();
  contactModalEL.onclick = e => e.stopPropagation();

  contactPageEl.append(withBackdropEl);
};

const fakeLoading = () => {
  document.body.style.pointerEvents = 'none';
  contactFormEl.classList.remove('fail');
  contactFormEl.classList.add('loading');
  setTimeout(() => {
    contactFormEl.classList.remove('loading');
    showContactModal();
    document.body.style.pointerEvents = 'all';
  }, 3000);
};

// Phone APIs
const countriesWrapperEl = contactPageEl.querySelector('.countries-wrapper');
const inputTel = contactPageEl.querySelector('#phone-submit');

// Phone Country
const iti = intlTelInput(inputTel, {
  customContainer: 'mb-1',
  dropdownContainer: countriesWrapperEl,
  autoPlaceholder: 'polite',
  customPlaceholder: (selectedCountryPh, selectedCountryData) => {
    return selectedCountryPh.replace(/[0-9]/g, 'X');
  },
  autoHideDialCode: true,
  separateDialCode: true,
  initialCountry: 'auto',
  geoIpLookup: async (success, failure) => {
    const getCountryCode = async () => {
      const resp = await fetch('https://extreme-ip-lookup.com/json/');
      const data = await resp.json();
      const { countryCode } = data;
      return countryCode;
    };
    try {
      const countryCode = await getCountryCode();
      success(countryCode);
    } catch (error) {
      console.error(error);
      success('us');
    }
  },
  utilsScript:
    'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.0/js/utils.js',
});

inputTel.addEventListener('open:countrydropdown', () =>
  countriesWrapperEl.classList.add('active')
);
inputTel.addEventListener('close:countrydropdown', () =>
  countriesWrapperEl.classList.remove('active')
);

// Phone Mask
inputTel.onfocus = () => {
  const pl = inputTel.getAttribute('placeholder');
  const res = pl.replace(/X/g, '9');
  const im = new Inputmask(res, {
    placeholder: 'X',
    clearMaskOnLostFocus: true,
  });
  im.mask(inputTel);
};

inputTel.oninput = () => {
  const pl = inputTel.getAttribute('placeholder');
  const res = pl.replace(/X/g, '9');
  const im = new Inputmask(res, {
    placeholder: 'X',
    clearMaskOnLostFocus: true,
  });
  im.mask(inputTel);
};

countriesWrapperEl.onclick = () => inputTel.focus();

const fakeLoadDebounced = debounce(fakeLoading, 100);
const contactHandler = () => {
  if (iti.isValidNumber()) return fakeLoadDebounced();
  contactFormEl.classList.add('fail');
};

const btnConfig = {
  num: 1,
  shift: 0.3,
  customEvents: {
    onClick: () => contactHandler(),
  },
};

const promoBtnEl = promoBtn('submit', btnConfig);
promoBtnEl.className += ' xl:opacity-0';
contactPageEl.append(promoBtnEl);
