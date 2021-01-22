import { cities } from '../../../store/cities';
import * as dimensions from '../../../shared/dimensions';

const mobRes = dimensions.curDimension !== dimensions.X_LARGE;

const fMapStyle = 'mapbox://styles/h1kiga/ckgl05xdx2e751anmfxwf3p4g/draft';
const sMapStyle = 'mapbox://styles/h1kiga/ckgs509lw0vk619px3n4ae839/draft';

// Map
const defaultConfig = {
  center: cities[0].cords,
  interactive: false,
};

const mobMap = {
  style: sMapStyle,
  zoom: 10,
};

const lgMap = {
  style: fMapStyle,
  zoom: 6,
  center: [138, 36],
};

const resMap = mobRes ? mobMap : lgMap;

const map = container => ({
  container,
  ...defaultConfig,
  ...resMap,
});

export default map;
