
class LogoutForm extends AsyncForm {

  onSubmit(data) {
    User.logout(data, (error, response) => {
      if (error) {
        throw new Error(error);
      }

      if (response && response.success) {
        this.element.reset();
        App.setState("user-logged");
        App.getModal("init");
      } else {
        return;
      }
    });
  }
}