/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (!User.current()) return;

    const selectAcc = this.element.querySelector(".accounts-select");
    if (!selectAcc) return;

    Account.list(User.current(), (error, response) => {
      if (error || !response || !response.data) return;

      selectAcc.innerHTML = "";
      response.data.forEach((account) => {
        const option = document.createElement("option");
        option.value = account.id;
        option.textContent = account.name;
        selectAcc.append(option);
      });
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (error, response) => {
      if (error) {
        throw new Error(error);
      }

      if (response && response.success) {
        this.element.reset();
        App.update();

        const modalType = data.type === "income" ? "newIncome" : "newExpense";
        App.getModal(modalType).close();
      }
    });
  }
}
