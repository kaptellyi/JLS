const backdrop = (el, isPermanent, customEvent) => {
  const backdropEl = document.createElement('div');
  const flexibleClasses = isPermanent ? 'opacity-0' : 'active';
  backdropEl.className = `backdrop z-50 absolute top-0 left-0 w-screen h-screen pointer-events-none bg-mediumBlack transition-all duration-300 ${flexibleClasses}`;
  backdropEl.append(el);
  backdropEl.onclick = () => {
    if (customEvent) {
      const myCustomEvent = new Event(customEvent.name);
      backdropEl.addEventListener(customEvent.name, customEvent.handler);
      backdropEl.dispatchEvent(myCustomEvent);
    }
    if (isPermanent) backdropEl.classList.remove('active');
    else backdropEl.remove();
  };

  return backdropEl;
};

export default backdrop;
