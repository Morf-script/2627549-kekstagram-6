import { pristine, initFormValidation } from './formValidation.js';
import { sendData } from './api.js';
import { resetScale, initScale } from './imageScale.js';
import { resetEffects, initEffects } from './imageEffects.js';
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

const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

let currentImageUrl = null;

function loadImage(file) {
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
  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${currentImageUrl})`;
  });
}

function openUploadForm() {
  if (!uploadOverlay || !uploadCancel) {
    return;
  }

  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);
  uploadCancel.addEventListener('click', closeUploadForm);
  resetScale();
}

function closeUploadForm() {
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
  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
    currentImageUrl = null;
  }

  document.removeEventListener('keydown', onFormEscKeydown);
  uploadCancel.removeEventListener('click', closeUploadForm);
}

function onFormEscKeydown(evt) {
  if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
    return;
  }

  if (document.querySelector('.error')) {
    return;
  }

  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadForm();
  }
}

function showMessage(template) {
  hideMessage();
  const messageElement = template.content.cloneNode(true).querySelector('section');
  const button = messageElement.querySelector('button');

  document.body.append(messageElement);

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  function onMessageEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopPropagation();
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    if (evt.target === messageElement) {
      closeMessage();
    }
  }

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onOutsideClick);
}

function hideMessage() {
  const existingMessage = document.querySelector('.success, .error');
  if (existingMessage) {
    existingMessage.remove();
  }
}

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

function handleFormSubmit(evt) {
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
}

export function initUploadForm() {
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
}

function onFileFieldChange() {
  const file = uploadInput.files[0];
  if (file) {
    loadImage(file);
    openUploadForm();
  }
}
