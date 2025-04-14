class LogoutForm extends AsyncForm {
  onSubmit() {
    User.logout((error) => {
      if (error) {
        console.error("Ошибка выхода:", error);
        return;
      }
      
      this.element.reset();
      App.setState("init");
      App.getModal("logout").close();
    });
  }
}
