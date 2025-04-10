class LogoutForm extends AsyncForm {
  onSubmit(data) {
    User.logout(data, (error, response) => {
      if (error) {
        throw new Error(error);
      }

      if (response && response.success) {
        App.setState("init"); 
        App.getModal("logout").close();
      } else {
        return;
      }
    });
  }
}
