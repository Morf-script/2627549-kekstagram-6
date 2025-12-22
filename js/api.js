const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

function getData(onSuccess, onFail) {
  fetch(`${SERVER_URL}/data`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => {
      onFail();
    });
}

function sendData(onSuccess, onFail, body) {
  fetch(`${SERVER_URL}/`, {
    method: 'POST',
    body,
  })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
}

export { getData, sendData };
