class Sidebar {
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

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

  static initAuthLinks() {
    const loginButton = document.querySelector(".menu-item_login a");
    const registrButton = document.querySelector(".menu-item_register a");
    const logoutButton = document.querySelector(".menu-item_login a");

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
        User.logout((err, response) => {
          if (err || !response.success) {
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
