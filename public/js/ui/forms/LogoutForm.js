class LogoutForm extends AsyncForm {
  onSubmit(data) {
    User.logout(data, (error, response) => {
      if (error || !response?.success) {
        return;
      }

      this.element.reset();
      App.setState("init");
      App.getModal("logout").close();
    });
  }
}
