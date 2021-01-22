import * as types from './types';
const GEO_DATA_NAME = 'CITIES';

const cities = [
  { title: types.TOKYO, cords: [139.703194, 35.663278], id: 'city-0' },
  { title: types.NAGOYA, cords: [136.882384, 35.199082], id: 'city-1' },
  { title: types.KYOTO, cords: [135.725788, 34.995174], id: 'city-3' },
];

const citiesGeoJson = {
  name: GEO_DATA_NAME,
  data: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: '0',
          geometry: {
            type: 'Point',
            coordinates: [139.769, 35.6804],
          },
          properties: {
            title: 'Tokyo',
            cords: '139.703194,35.663278',
          },
        },
        {
          type: 'Feature',
          id: '1',
          geometry: {
            type: 'Point',
            coordinates: [136.9066, 35.1815],
          },
          properties: {
            title: 'Nagoya',
            cords: '136.882384,35.199082',
          },
        },
        {
          type: 'Feature',
          id: '2',
          geometry: {
            type: 'Point',
            coordinates: [135.7681, 35.0116],
          },
          properties: {
            title: 'Kyoto',
            cords: '135.725788,34.995174',
          },
        },
      ],
    },
  },
};

export { cities, citiesGeoJson };
