class Modal {
  constructor(element) {
    this.element = element;
    this.registerEvents();

    if (!element) {
      throw new Error("Переданный элемент (всплывающее окно) не существует");
    }
  }

  registerEvents() {
    const modalCloseButtons = Array.from(
      document.querySelectorAll('[data-dismiss="modal"]')
    );

    modalCloseButtons.forEach((closeBtn) => {
      closeBtn.addEventListener("touchend", () => this.onClose());
    });
  }

  onClose(event) {
    event.preventDefault();
    this.close();
  }

  open() {
    this.element.style.setProperty("display", "block");
  }

  close() {
    this.element.style.setProperty("display", "none");
  }
}
