import { renderPhotos } from './renderPhotos.js';
import { debounce } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;
const RERENDER_DELAY = 500;

const filtersElement = document.querySelector('.img-filters');
const filtersFormElement = filtersElement.querySelector('.img-filters__form');

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

let currentFilter = FilterType.DEFAULT;
let pictures = [];

const sortRandomly = () => Math.random() - 0.5;

const sortByComments = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const getFilteredPictures = () => {
  switch (currentFilter) {
    case FilterType.RANDOM:
      return [...pictures].sort(sortRandomly).slice(0, RANDOM_PHOTOS_COUNT);
    case FilterType.DISCUSSED:
      return [...pictures].sort(sortByComments);
    default:
      return [...pictures];
  }
};

const updateActiveButton = (clickedButton) => {
  const currentActiveButton = filtersFormElement.querySelector('.img-filters__button--active');
  if (currentActiveButton) {
    currentActiveButton.classList.remove('img-filters__button--active');
  }
  clickedButton.classList.add('img-filters__button--active');
};

const debouncedRender = debounce((filteredPictures) => {
  renderPhotos(filteredPictures);
}, RERENDER_DELAY);

const onFilterClick = (evt) => {
  const clickedButton = evt.target;
  if (!clickedButton.classList.contains('img-filters__button')) {
    return;
  }

  if (clickedButton.id === currentFilter) {
    return;
  }

  currentFilter = clickedButton.id;
  updateActiveButton(clickedButton);
  debouncedRender(getFilteredPictures());
};

export const initFilters = (loadedPictures) => {
  pictures = loadedPictures;
  filtersElement.classList.remove('img-filters--inactive');
  filtersFormElement.addEventListener('click', onFilterClick);
};
