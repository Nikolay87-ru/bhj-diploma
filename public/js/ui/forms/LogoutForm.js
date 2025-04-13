class LogoutForm extends AsyncForm {
  onSubmit(data) {
    User.logout(data, (error, response) => {
      if (error || !response?.success) return;

      if (response && response.success) {
        App.setState("init"); 
        App.getModal("logout").close();
      } 
    });
  }
}
