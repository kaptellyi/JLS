import markerSvg from '../../../assets/icons/g-marker.webp';

export const duration = 300;

export const markerImg = new Image(40, 40);
markerImg.className = 'g-marker';
markerImg.src = markerSvg;

export const map = () => ({
  fMapStyle: 'mapbox://styles/h1kiga/ckgl05xdx2e751anmfxwf3p4g/draft',
  sMapStyle: 'mapbox://styles/h1kiga/ckgs509lw0vk619px3n4ae839/draft',
});

export const marker = isActive => {
  return {
    color: isActive ? '#E74C3C' : '#600313',
  };
};

export const popup = () => ({
  className: 'popup w-40 flex flex-col',
  closeButton: false,
  closeOnClick: false,
  anchor: 'left',
  offset: 20,
});
