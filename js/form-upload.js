import { pristine, initFormValidation } from './form-validation.js';
import { sendData } from './api.js';
import { resetScale, initScale } from './image-scale.js';
import { resetEffects, initEffects } from './image-effects.js';
import { isEscapeKey } from './util.js';

const uploadInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('#upload-cancel');
const uploadForm = document.querySelector('.img-upload__form');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const uploadSubmit = document.querySelector('#upload-submit');
const successTemplate = document.querySelector('#success');
const errorTemplate = document.querySelector('#error');
const imgPreview = document.querySelector('.img-upload__preview img');
const effectPreviewsElements = document.querySelectorAll('.effects__preview');

const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

let currentImageUrl = null;

const hideMessage = () => {
  const existingMessage = document.querySelector('.success, .error');
  if (existingMessage) {
    existingMessage.remove();
  }
};

const loadImage = (file) => {
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (!matches) {
    return;
  }

  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }

  currentImageUrl = URL.createObjectURL(file);
  imgPreview.src = currentImageUrl;
  effectPreviewsElements.forEach((preview) => {
    preview.style.backgroundImage = `url(${currentImageUrl})`;
  });
};

let onFormEscKeydown = null;

const closeUploadForm = () => {
  uploadForm.reset();
  if (pristine) {
    pristine.reset();
  }
  resetScale();
  resetEffects();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadInput.value = '';
  imgPreview.src = 'img/upload-default-image.jpg';
  effectPreviewsElements.forEach((preview) => {
    preview.style.backgroundImage = '';
  });
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
    currentImageUrl = null;
  }

  if (onFormEscKeydown) {
    document.removeEventListener('keydown', onFormEscKeydown);
  }
  uploadCancel.removeEventListener('click', closeUploadForm);
};

onFormEscKeydown = (evt) => {
  const isInputFocused = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;
  const hasError = document.querySelector('.error');

  if (isInputFocused || hasError) {
    return;
  }

  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadForm();
  }
};

const openUploadForm = () => {
  if (!uploadOverlay || !uploadCancel) {
    return;
  }

  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);
  uploadCancel.addEventListener('click', closeUploadForm);
  resetScale();
};

const showMessage = (template) => {
  hideMessage();
  const messageElement = template.content.cloneNode(true).querySelector('section');
  const button = messageElement.querySelector('button');

  document.body.append(messageElement);

  let closeMessage = null;

  const onMessageEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopPropagation();
      if (closeMessage) {
        closeMessage();
      }
    }
  };

  const onOutsideClick = (evt) => {
    if (evt.target === messageElement) {
      if (closeMessage) {
        closeMessage();
      }
    }
  };

  closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onOutsideClick);
};

const blockSubmitButton = () => {
  if (uploadSubmit) {
    uploadSubmit.disabled = true;
    uploadSubmit.textContent = 'Публикую...';
  }
};

const unblockSubmitButton = () => {
  if (uploadSubmit) {
    uploadSubmit.disabled = false;
    uploadSubmit.textContent = 'Опубликовать';
  }
};

const handleFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine) {
    return;
  }

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  blockSubmitButton();
  sendData(
    () => {
      closeUploadForm();
      showMessage(successTemplate);
      unblockSubmitButton();
    },
    () => {
      showMessage(errorTemplate);
      unblockSubmitButton();
    },
    new FormData(evt.target)
  );
};

const onFileFieldChange = () => {
  const file = uploadInput.files[0];
  if (file) {
    loadImage(file);
    openUploadForm();
  }
};

export const initUploadForm = () => {
  if (!uploadForm || !uploadInput) {
    return;
  }

  initFormValidation();

  uploadInput.addEventListener('change', onFileFieldChange);

  hashtagsInput.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });

  descriptionInput.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });

  initScale();
  initEffects();
  uploadForm.addEventListener('submit', handleFormSubmit);
};
