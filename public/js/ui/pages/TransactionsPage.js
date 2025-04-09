/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Не передан элемент формы");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".transaction__remove")) {
        event.preventDefault();
        this.removeTransaction(event.target.closest(".transaction__remove"));
      }
      
      if (event.target.closest(".remove-account")) {
        event.preventDefault();
        this.removeAccount();
      }
      
      if (event.target.closest(".message__remove")) {
        this.confirmRemoveAccount();
      }
      
      if (event.target.closest(".message__refuse")) {
        this.closeMessage();
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    const activeAccount = document.querySelector(".account.active");
    
    if (!activeAccount) {
      console.log("выберите счёт для удаления");
      return;
    }

    this.accountToRemove = activeAccount; // Сохраняем для последующего удаления
    
    const messageHTML = `
      <div class="message-overlay">
        <div class="message-box">
          <div class="message__title">Вы действительно хотите удалить "${activeAccount.querySelector('span').textContent}"?</div>
          <div class="message__buttons">
            <button class="btn btn-danger message__remove">Да, удалить</button>
            <button class="btn btn-default message__refuse">Отмена</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', messageHTML);
  }

  confirmRemoveAccount() {
    if (!this.accountToRemove) return;
    
    const accountId = this.accountToRemove.dataset.id;
    
    Account.remove({ id: accountId }, (error, response) => {
      this.closeMessage();
      
      if (error || !response.success) {
        console.log("Ошибка при удалении счёта");
        return;
      }

      this.accountToRemove.remove();
      this.accountToRemove = null;
      
      const accounts = document.querySelectorAll(".account");
      if (accounts.length > 0) {
        accounts[0].classList.add("active");
        App.showPage("transactions", { account_id: accounts[0].dataset.id });
      } else {
        App.showPage("transactions", { account_id: null });
      }

      App.updateWidgets();
      App.updateForms();
    });
  }

  closeMessage() {
    const message = document.querySelector(".message-overlay");
    if (message) {
      message.remove();
    }
    this.accountToRemove = null;
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {}

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {}

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {}

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {}

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {}

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {}

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {}
}
