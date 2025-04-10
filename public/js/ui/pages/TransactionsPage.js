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
    if (!element) throw new Error("Не передан элемент формы");
    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".remove-account")) {
        e.preventDefault();
        this.removeAccount();
      }

      if (e.target.closest(".confirm-remove")) {
        this.confirmAccountRemove();
      }

      if (e.target.closest(".cancel-remove")) {
        this.closeConfirmMessage();
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
      return;
    }

    const messageHTML = `
      <div class="confirm-message" data-account-id="${
        activeAccount.dataset.id
      }">
        <div class="message-content">
          <p>Вы действительно хотите удалить счёт "${
            activeAccount.querySelector("span").textContent
          }"?</p>
          <div class="message-buttons">
            <button class="btn btn-danger confirm-remove">Удалить</button>
            <button class="btn btn-default cancel-remove">Отмена</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", messageHTML);
  }

  confirmAccountRemove() {
    const confirmMessage = document.querySelector(".confirm-message");
    if (!confirmMessage) return;

    const accountId = confirmMessage.dataset.accountId;
    const activeAccount = document.querySelector(
      `.account[data-id="${accountId}"]`
    );

    Account.remove({ id: accountId }, (err, response) => {
      this.closeConfirmMessage();

      if (err || !response.success) {
        return;
      }

      if (activeAccount) {
        activeAccount.remove();
      }

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

  closeConfirmMessage() {
    const confirmMessage = document.querySelector(".confirm-message");
    if (confirmMessage) confirmMessage.remove();
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
  render(options) {
    if (!options.account_id) return;
    this.lastOptions = options;

    Account.get(options.account_id, (error, account) => {
      if (error || !account) return;
      this.renderTitle(account.name);
    });

    Transaction.list(options, (error, response) => {
      if (error || !response.data) return;
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = this.element.querySelector(".content-title");
    const description = this.element.querySelector(".content-description");
    title.textContent = name;
    description.textContent = "Счёт";
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const today = new Date(date);

    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const hours = today.getHours().toString().padStart(2, "0");
    const minutes = today.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

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
