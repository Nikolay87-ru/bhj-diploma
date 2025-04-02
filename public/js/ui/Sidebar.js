class Sidebar {
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  static initToggleButton() {
    document.addEventListener("DOMContentLoaded", () => {
      const sidebarToggle = document.querySelector(".sidebar-toggle");

      if (sidebarToggle) {
        sidebarToggle.addEventListener("touchend", (event) => {
          event.preventDefault();

          const sidebar = document.querySelector(".sidebar-mini");

          const isSidebarOpen =
            sidebar.classList.contains("sidebar-open") ||
            sidebar.classList.contains("sidebar-collapse");

          if (isSidebarOpen) {
            sidebar.classList.remove("sidebar-open", "sidebar-collapse");
          } else {
            sidebar.classList.add("sidebar-open", "sidebar-collapse");
          }
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
    
  }
}
