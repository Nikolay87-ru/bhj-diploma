class Sidebar {
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  static initToggleButton() {
    document.addEventListener("DOMContentLoaded", () => {
      const sidebarToggle = document.querySelector(".sidebar-toggle");
      const sidebar = document.querySelector(".sidebar-mini");

      sidebar.classList.add("sidebar-collapse");

      if (sidebarToggle) {
        sidebarToggle.addEventListener("touchend", (event) => {
          event.preventDefault();

          sidebar.classList.toggle("sidebar-open");
          sidebar.classList.toggle("sidebar-collapse");
        });
      }
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginButton = document.querySelector(".menu-item_login a");
    const registrButton = document.querySelector(".menu-item_register a");
    const logoutButton = document.querySelector(".menu-item_login a");

    if (loginButton) {
      loginButton.addEventListener("touchend", (event) => {
        event.preventDefault();
        App.getModal("login").open();
      });
    }

    if (registrButton) {
      registrButton.addEventListener("touchend", (event) => {
        event.preventDefault();
        App.getModal("register").open();
      });
    }

    if (loginButton) {
      loginButton.addEventListener("touchend", (event) => {
        event.preventDefault();
        User.logout((err, response) => {
          if (response && response.success) {
            App.setState("init");
          }
        });
      });
    }
  }
}
