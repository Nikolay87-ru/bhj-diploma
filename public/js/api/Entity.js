class Entity {
  static URL = "";

  static list(data, callback) {
    createRequest({
      url: this.URL,
      method: 'GET',
      data: data,
      callback: callback
    });
  }

  static create(data, callback) {
    createRequest({
      url: this.URL,
      method: 'PUT',
      data: data,
      callback: callback
    });
  }

  static remove(data, callback) {
    createRequest({
      url: this.URL,
      method: 'DELETE',
      data: data,
      callback: callback
    });
  }
}
