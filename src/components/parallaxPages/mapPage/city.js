import { citiesGeoJson, cities } from '../../../store/cities';
import { activateMarker, openCords } from '../../../store/map';

// Components
const cityMapComp = city => {
  const cityMapEl = document.createElement('div');
  cityMapEl.id = `${city.id}__map`;
  cityMapEl.className = 'city__map w-full h-0 transition-all duration-500';

  cityMapEl.onclick = () => openCords(city.cords[0], city.cords[1]);

  return cityMapEl;
};

const cityComp = (map, city) => {
  const cityEl = document.createElement('article');
  cityEl.id = `${city.id}`;
  cityEl.className =
    'city font-bold text-lg h-full w-full flex flex-col cursor-pointer';
  cityEl.innerHTML = `<h4 class="h-2/6 md:h-12 pl-2 capitalize text-xl md:text-2xl align-bottom flex items-center">${city.title.toLowerCase()}</h4>`;
  cityEl.append(cityMapComp(city));

  cityEl.onclick = () => updateActiveCity(map, city);

  return cityEl;
};

const citiesWrapperComp = () => {
  const citiesWrapperEl = document.createElement('div');
  citiesWrapperEl.className =
    'cities-wrapper absolute top-0 m-2 md:m-4 w-40 md:w-56 shadow-xl';
  return citiesWrapperEl;
};

export { citiesWrapperComp, cityComp };

// Events
const updateActiveCity = (map, activeCity) => {
  const { features } = citiesGeoJson.data.data;
  const citiesWrapperEl = document.querySelector('.cities-wrapper');
  const cityEls = citiesWrapperEl.querySelectorAll('.city');
  const activeCityIndex = cities.findIndex(
    c => c.id.toLowerCase() === activeCity.id.toLowerCase()
  );
  Array.from(cityEls).forEach(el => el.classList.remove('active'));
  cityEls[activeCityIndex].classList.add('active');

  const cb = (src, state) => map.setFeatureState(src, state);
  map.flyTo({ center: activeCity.cords });
  activateMarker(cb, features[activeCityIndex].id);
};
