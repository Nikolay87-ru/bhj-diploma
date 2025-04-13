class LogoutForm extends AsyncForm {
  onSubmit(data) {
    User.logout(data, (error, response) => {
      if (error || !response?.success) {
        console.error('Ошибка при выходе:', error || response.error);
        return;
      }

      this.element.reset();
      App.setState('init');
      App.getModal('logout').close();
    });
  }
}
