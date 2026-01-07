import { initUploadForm } from './form-upload.js';
import { renderPhotos } from './render-photos.js';
import { getData } from './api.js';
import { showAlert } from './util.js';
import { initFilters } from './filters.js';

const initializeApp = () => {
  if (typeof window.Pristine !== 'function') {
    setTimeout(initializeApp, 100);
    return;
  }

  getData(
    (photos) => {
      renderPhotos(photos);
      initFilters(photos);
    },
    () => {
      showAlert('Не удалось загрузить данные. Попробуйте обновить страницу');
    }
  );

  initUploadForm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 0);
  });
} else {
  setTimeout(initializeApp, 0);
}
