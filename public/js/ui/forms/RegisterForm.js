/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (error, response) => {
      if (error || !response?.success) return;

      if (response && response.user) {
        User.setCurrent(response.user);
        this.element.reset();
        App.setState("user-logged");
        App.getModal("register").close();
      } 
    });
  }
}
