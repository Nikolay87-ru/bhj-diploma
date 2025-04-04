const createRequest = (options = {}) => {
  const {
    url,
    method = "GET",
    data,
    callback,
    responseType = "json",
  } = options;

  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;

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

  if (method !== "GET") {
    if (data) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }
  }

  xhr.addEventListener("load", () => {
    if (callback) {
      if (xhr.status >= 200 && xhr.status < 300) {
        callback(null, xhr.response);
      } else {
        callback(new Error(`Ошибка HTTP: ${xhr.status}`), null);
      }
    }
  });

  xhr.addEventListener("error", () => {
    if (callback) {
      callback(new Error("Ошибка сети"), null);
    }
  });

  xhr.open(method, requestUrl);
  xhr.send(method === "GET" ? null : formData);
  return xhr;
};
