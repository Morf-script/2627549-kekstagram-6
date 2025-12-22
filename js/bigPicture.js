const bigPictureElement = document.querySelector('.big-picture');
const bodyElement = document.querySelector('body');
const cancelButton = bigPictureElement.querySelector('.big-picture__cancel');
const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const commentsContainer = bigPictureElement.querySelector('.social__comments');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCount = bigPictureElement.querySelector('.likes-count');
const socialCaption = bigPictureElement.querySelector('.social__caption');

const COMMENTS_PER_PORTION = 5;

let currentComments = [];
let displayedComments = 0;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(avatar);
  commentElement.appendChild(text);

  return commentElement;
};

const renderCommentsPortion = (initial = false) => {
  if (initial) {
    commentsContainer.innerHTML = '';
    displayedComments = 0;
  }

  const fragment = document.createDocumentFragment();
  const commentsToShow = Math.min(displayedComments + COMMENTS_PER_PORTION, currentComments.length);

  for (let i = displayedComments; i < commentsToShow; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    fragment.appendChild(commentElement);
  }

  commentsContainer.appendChild(fragment);
  displayedComments = commentsToShow;

  commentCountElement.innerHTML = `<span class="social__comment-shown-count">${displayedComments}</span> из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;

  if (displayedComments >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
};

function onEscKeyDown(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscKeyDown);

  currentComments = [];
  displayedComments = 0;
}

const openBigPicture = (photo) => {
  bigPictureImg.src = photo.url;
  likesCount.textContent = photo.likes;
  socialCaption.textContent = photo.description;

  currentComments = photo.comments.slice();

  renderCommentsPortion(true);

  commentCountElement.classList.remove('hidden');

  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeyDown);
};

cancelButton.addEventListener('click', closeBigPicture);
commentsLoaderElement.addEventListener('click', () => renderCommentsPortion());

export { openBigPicture, closeBigPicture };
