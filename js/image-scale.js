const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');

const scaleImage = (value) => {
  imagePreview.style.transform = `scale(${value / 100})`;
  scaleInput.value = `${value}%`;
};

const onSmallerButtonClick = () => {
  const currentValue = parseInt(scaleInput.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, MIN_SCALE);
  scaleImage(newValue);
};

const onBiggerButtonClick = () => {
  const currentValue = parseInt(scaleInput.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, MAX_SCALE);
  scaleImage(newValue);
};

const resetScale = () => {
  scaleImage(DEFAULT_SCALE);
};

const initScale = () => {
  smallerButton.addEventListener('click', onSmallerButtonClick);
  biggerButton.addEventListener('click', onBiggerButtonClick);
};

export { resetScale, initScale };
