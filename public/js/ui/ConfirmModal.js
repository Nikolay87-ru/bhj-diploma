class ConfirmModal extends Modal {
  constructor(elementId) {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element #${elementId} not found`);

    super(element);
    this.onConfirm = () => {};
    this.onCancel = () => {};
    this.element.style.display = "none";
    this.registerEvents();
  }

  registerEvents() {
    this.element
      .querySelector(".confirm-button")
      .addEventListener("click", () => {
        this.onConfirm();
        this.close();
      });

    this.element
      .querySelector(".cancel-button")
      .addEventListener("click", () => {
        this.onCancel();
        this.close();
      });
  }

  setContent(options = {}) {
    if (options.title) {
      this.element.querySelector(".modal-title").textContent = options.title;
    }
    if (options.content) {
      this.element.querySelector(".modal-body p").textContent = options.content;
    }
    if (options.confirmText) {
      this.element.querySelector(".confirm-button").textContent =
        options.confirmText;
    }
    if (options.cancelText) {
      this.element.querySelector(".cancel-button").textContent =
        options.cancelText;
    }
    return this;
  }
}
