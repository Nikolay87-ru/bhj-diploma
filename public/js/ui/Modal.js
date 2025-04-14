/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element)
      throw new Error("Переданный элемент (всплывающее окно) не существует");

    this.element = element;
    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    const modalCloseButtons = Array.from(
      document.querySelectorAll('[data-dismiss="modal"]')
    );

    modalCloseButtons.forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => this.onClose());
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose() {
    this.close();
  }

  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    document.querySelectorAll(".modal.show").forEach((modal) => {
      if (modal !== this.element) {
        modal.style.display = "none";
        modal.classList.remove("show");
      }
    });

    this.element.style.display = "block";
    this.element.classList.add("show");
    document.body.classList.add("modal-open");

    const zIndex = 1050 + Object.keys(App.modals).length;
    this.element.style.zIndex = zIndex;

    this.backdrop = document.createElement("div");
    this.backdrop.className = "modal-backdrop fade show";
    this.backdrop.style.zIndex = zIndex - 1;
    document.body.appendChild(this.backdrop);
  }

  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close() {
    this.element.classList.remove("show");
    this.element.style.display = "none";
    document.body.classList.remove("modal-open");

    if (this.backdrop && this.backdrop.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop);
    }
  }
}
