export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...rest), timeoutDelay);
  };
};

export const isEscapeKey = (evt) => evt.key === 'Escape';

const ALERT_SHOW_TIME = 5000;
const ALERT_Z_INDEX = '100';
const ALERT_PADDING = '10px 3px';
const ALERT_FONT_SIZE = '30px';
const ALERT_BACKGROUND_COLOR = 'red';

export const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = ALERT_Z_INDEX;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = ALERT_PADDING;
  alertContainer.style.fontSize = ALERT_FONT_SIZE;
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = ALERT_BACKGROUND_COLOR;
  alertContainer.classList.add('data-error');

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};
