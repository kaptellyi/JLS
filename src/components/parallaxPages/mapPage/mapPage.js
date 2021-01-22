import '@styles/parallax-pages/map-page.css';
import mapboxgl from 'mapbox-gl';
import * as types from '../../../store/types';
import * as dimensions from '../../../shared/dimensions';
import { citiesGeoJson, cities } from '../../../store/cities';
import {
  activateMarker,
  disActivateMarker,
  setActiveMarker,
  openCords,
} from '../../../store/map';
import mapConfig from './mapConfig';
import * as mapStyles from './mapStyles';
import { markerImg } from './mapStyles';
import scrollButtons from '../../UI/scrollButtons';
import { citiesWrapperComp, cityComp } from './city';

const mobRes = dimensions.curDimension !== dimensions.X_LARGE;

const token =
  'pk.eyJ1IjoiaDFraWdhIiwiYSI6ImNrZ2t6czd6bjBmMDEydW1wMWh3MjF5cmMifQ.VdQpP1kLlD-5i2YvtD6Hmg';
mapboxgl.accessToken = token;

const mapPageEl = document.querySelector('.map-page');
const changeActiveMarkerCb = (src, state) => map.setFeatureState(src, state);
const map = new mapboxgl.Map({
  ...mapConfig('map-container'),
});
const popup = new mapboxgl.Popup(mapStyles.popup());

// Logic
const addMap = city => {
  const cityMap = new mapboxgl.Map({
    container: `${city.id}__map`,
    style: mapStyles.map().sMapStyle,
    center: city.cords,
    zoom: 14,
    interactive: false,
  });

  const markerEl = document
    .getElementById('marker-el-temp')
    .content.cloneNode(true).firstElementChild;
  new mapboxgl.Marker({
    element: markerEl,
    color: mapStyles.marker(true).color,
    anchor: 'bottom',
  })
    .setLngLat(city.cords)
    .addTo(cityMap);
};

const showPopup = e => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const { title } = e.features[0].properties;
  const hoveredCity = cities.find(
    c => c.title.toLowerCase() === title.toLowerCase()
  );
  const cityEl = cityComp(map, hoveredCity);
  cityEl.classList.add('active');

  popup.setLngLat(coordinates).setDOMContent(cityEl).addTo(map);
  addMap(hoveredCity);
};

// Init
map.on('sourcedata', e => {
  if (mobRes && e.isSourceLoaded) {
    const featureState = map.querySourceFeatures(types.GEO_DATA_NAME)[0];
    featureState && setActiveMarker(changeActiveMarkerCb, featureState.id);
  }
});

if (mobRes) {
  const citiesWrapperEl = citiesWrapperComp();
  mapPageEl.append(citiesWrapperEl);
  cities.forEach((c, i) => {
    const cityEl = cityComp(map, c);
    if (i === 0) cityEl.classList.add('active');
    citiesWrapperEl.append(cityEl);
    addMap(c);
  });
}

map.on('load', () => {
  map.addImage('custom-marker', markerImg, { sdf: true });

  const { data } = citiesGeoJson;
  map.addSource(types.GEO_DATA_NAME, data);
  map.addLayer({
    id: types.CITIES_LAYER_NAME,
    type: 'symbol',
    source: types.GEO_DATA_NAME,
    layout: {
      'icon-image': 'custom-marker',
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
    },
    paint: {
      'icon-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        mapStyles.marker(true).color,
        mapStyles.marker(false).color,
      ],
    },
  });

  if (mobRes) return;
  map.on('mouseenter', types.CITIES_LAYER_NAME, e => {
    map.getCanvas().style.cursor = 'pointer';
    showPopup(e);
    activateMarker(changeActiveMarkerCb, e.features[0].id);
  });

  map.on('mouseleave', types.CITIES_LAYER_NAME, () => {
    map.getCanvas().style.cursor = '';
    disActivateMarker(changeActiveMarkerCb);
    popup.remove();
  });

  map.on('click', types.CITIES_LAYER_NAME, e => {
    const [c1, c2] = e.features[0].properties.cords.split(',');
    openCords(c1, c2);
  });
});

mapPageEl.append(scrollButtons());
