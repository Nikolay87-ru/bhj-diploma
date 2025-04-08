/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
    /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

    /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    document.addEventListener("DOMContentLoaded", () => {
      const sidebarToggle = document.querySelector(".sidebar-toggle");
      const sidebar = document.querySelector(".sidebar-mini");

      if (sidebarToggle) {
        sidebarToggle.addEventListener("click", (event) => {
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
    const logoutButton = document.querySelector(".menu-item_logout a");

    if (loginButton) {
      loginButton.addEventListener("click", (event) => {
        event.preventDefault();
        App.getModal("login").open();
      });
    }

    if (registrButton) {
      registrButton.addEventListener("click", (event) => {
        event.preventDefault();
        App.getModal("register").open();
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        User.logout((error, response) => {
          if (error || !response.success) {
            return;
          }

          if (response && response.success) {
            App.setState("init");
          }
        });
      });
    }
  }
}
