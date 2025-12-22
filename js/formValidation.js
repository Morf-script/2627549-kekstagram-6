const MAX_HASHTAGS_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');

let pristine = null;

const validateHashtagsCount = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  return hashtags.length <= MAX_HASHTAGS_COUNT;
};

const validateHashtagsFormat = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  return !hashtags.some((hashtag) => !VALID_HASHTAG_REGEX.test(hashtag));
};

const validateNonEmptyHashtag = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  return !hashtags.some((hashtag) => hashtag === '#');
};

const validateHashtagsUnique = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  const uniqueHashtags = new Set(hashtags.map((hashtag) => hashtag.toLowerCase()));
  return uniqueHashtags.size === hashtags.length;
};

const validateComment = (value) => !value || value.length <= MAX_COMMENT_LENGTH;

function initFormValidation() {
  if (!form || !hashtagsInput || !descriptionInput) {
    return;
  }

  if (typeof window.Pristine !== 'function') {
    return;
  }

  if (pristine) {
    pristine.destroy();
  }

  pristine = new window.Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  pristine.addValidator(
    hashtagsInput,
    validateHashtagsCount,
    `Нельзя указать больше ${MAX_HASHTAGS_COUNT} хэш-тегов`
  );

  pristine.addValidator(
    hashtagsInput,
    validateHashtagsFormat,
    'Хэш-тег должен начинаться с # и содержать только буквы и цифры (до 20 символов)'
  );

  pristine.addValidator(
    hashtagsInput,
    validateNonEmptyHashtag,
    'Хэш-тег не может состоять только из символа #'
  );

  pristine.addValidator(
    hashtagsInput,
    validateHashtagsUnique,
    'Один и тот же хэш-тег не может быть использован дважды'
  );

  pristine.addValidator(
    descriptionInput,
    validateComment,
    `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
  );
}

export { pristine, initFormValidation };
