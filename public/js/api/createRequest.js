/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const { url, method = "GET", data, callback } = options;

  let requestUrl = url;
  const formData = new FormData();

  if (method === "GET") {
    if (data) {
      const params = new URLSearchParams();
      for (const key in data) {
        params.append(key, data[key]);
      }
      requestUrl += `?${params.toString()}`;
    }
  }

  if (!method === "GET") {
    if (data) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }
  }

  fetch(requestUrl, {
    method,
    body: method === "GET" ? null : formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      if (callback) callback(null, response);
    })
    .catch((error) => {
      if (callback) callback(error, null);
    });
};
