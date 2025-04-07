class Entity {
  static URL = "";

  static list(data, callback) {
    createRequest({
      url: this.URL,
      method: 'GET',
      data: data,
      responseType: 'json',
      callback: callback
    });
  }

  static create(data, callback) {
    createRequest({
      url: this.URL,
      method: 'PUT',
      data: data,
      responseType: 'json',
      callback: callback
    });
  }

  static remove(data, callback) {
    createRequest({
      url: this.URL,
      method: 'DELETE',
      data: data,
      responseType: 'json',
      callback: callback
    });
  }
}
