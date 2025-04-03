class User {
  static URL = " /user";

  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  static current() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : undefined;
  }

  static fetch(callback) {
    createRequest({
      url: this.URL + "/user",
      method: "GET",
      responseType: "json",
      callback: (err, response) => {
        if (response && response.success) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }

  static login(data, callback) {
    createRequest({
      url: this.URL + "/login",
      method: "POST",
      responseType: "json",
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  static register(data, callback) {
    createRequest({
      url: this.URL + "/register",
      method: "POST",
      responseType: "json",
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  static logout(callback) {
    createRequest({
      url: this.URL + "/logout",
      method: "POST",
      responseType: "json",
      callback: (err, response) => {
        if (response && response.success) {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }
}
