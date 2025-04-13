/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const {
    url,
    method = "GET",
    data = {},
    callback = () => {},
    responseType = "json",
  } = options;

  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;

  let requestUrl = url;
  const formData = new FormData();

  if (method === "GET") {
    const params = new URLSearchParams();
    for (const key in data) {
      params.append(key, data[key]);
    }
    requestUrl += `?${params.toString()}`;
  } else {
    for (const key in data) {
      formData.append(key, data[key]);
    }
  }

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      callback(new Error(`Ошибка HTTP: ${xhr.status}`), null);
    }
  });

  xhr.addEventListener("error", () => {
    callback(new Error("Ошибка сети"), null);
  });

  xhr.addEventListener("timeout", () => {
    callback(new Error("Запрос превысил время ожидания"), null);
  });

  try {
    xhr.open(method, requestUrl);
    xhr.send(method === "GET" ? null : formData);
    return xhr;
  } catch (error) {
    callback(new Error(`Ошибка при выполнении запроса: ${error.message}`), null);
    return null;
  }
};
