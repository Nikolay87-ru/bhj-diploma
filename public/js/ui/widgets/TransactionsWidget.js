/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) throw new Error("Не передан элемент формы");

    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = document.querySelector(".create-income-button");
    const expenseButton = document.querySelector(".create-expense-button");

    incomeButton.addEventListener("click", (event) => {
      event.preventDefault();
      App.getModal("confirmAccount").close();
      App.getModal("confirmTransaction").close();
      App.getModal("newIncome").open();
    });

    expenseButton.addEventListener("click", (event) => {
      event.preventDefault();
      App.getModal("confirmAccount").close();
      App.getModal("confirmTransaction").close();
      App.getModal("newExpense").open();
    });
  }
}
