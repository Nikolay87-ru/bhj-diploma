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
    document.addEventListener("click", (event) => {
      if (event.target.closest(".remove-account")) {
        event.preventDefault();
        this.removeAccount();
      }

      const removeButton = event.target.closest(".transaction__remove");
      if (removeButton) {
        event.preventDefault();
        const transactionId = removeButton.dataset.id;
        const transactionElement = removeButton.closest(".transaction");
        const transactionName = transactionElement.querySelector(
          ".transaction__title"
        ).textContent;

        this.removeTransaction(transactionId, {
          name: transactionName,
        });
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

  showConfirmModal(options) {
    const { id, type, title, confirmText, cancelText } = options;
    const modalHTML = `
      <div class="confirm-modal" data-${type}-id="${id}">
        <div class="modal-content">
          <p>${title}</p>
          <div class="modal-buttons">
            <button class="btn btn-danger confirm-${type}-remove">${confirmText}</button>
            <button class="btn btn-default cancel-${type}-remove">${cancelText}</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const confirmButton = document.querySelector(`.confirm-${type}-remove`);
    const cancelButton = document.querySelector(`.cancel-${type}-remove`);

    if (confirmButton && cancelButton) {
      confirmButton.addEventListener("click", () => {
        if (type === "account") {
          this.confirmAccountRemove();
        } else if (type === "transaction") {
          this.confirmTransactionRemove();
        }
      });

      cancelButton.addEventListener("click", () => {
        this.closeConfirmModal();
      });
    }
  }

  removeAccount() {
    const activeAccount = document.querySelector(".account.active");
    if (!activeAccount) {
      this.showNoAccountMessage();
      return;
    }

    this.showConfirmModal({
      id: activeAccount.dataset.id,
      type: "account",
      title: `Вы действительно хотите удалить счёт "${
        activeAccount.querySelector("span").textContent
      }"?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
    });
  }

  confirmAccountRemove() {
    const confirmModal = document.querySelector(".confirm-modal");
    if (!confirmModal) return;

    const accountId = confirmModal.dataset.accountId;
    const activeAccount = document.querySelector(
      `.account[data-id="${accountId}"]`
    );

    Account.remove({ id: accountId }, (err, response) => {
      this.closeConfirmModal();

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

  showNoAccountMessage() {
    const existingMessage = document.querySelector(".user-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const message = document.createElement("div");
    message.className = "user-message";
    message.innerHTML = `
      <span class="message__remove">Выберите счёт для удаления!</span>
    `;

    const h1 = this.element.querySelector("h1");
    h1.insertAdjacentElement("afterend", message);

    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id, data) {
    this.showConfirmModal({
      id,
      type: "transaction",
      title: `Вы действительно хотите удалить транзакцию "${data.name}"?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
    });
  }

  confirmTransactionRemove() {
    const confirmModal = document.querySelector(".confirm-modal");
    if (!confirmModal) return;

    const transactionId = confirmModal.dataset.transactionId;

    Transaction.remove({ id: transactionId }, (error, response) => {
      this.closeConfirmModal();

      if (error || !response.success) {
        return;
      }

      if (this.lastOptions) {
        this.render(this.lastOptions);
      }
      App.update();
    });
  }

  closeConfirmModal() {
    const confirmModal = document.querySelector(".confirm-modal");
    if (confirmModal) confirmModal.remove();
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) return;
    this.lastOptions = options;

    Account.get(options.account_id, (error, account) => {
      if (error || !account) {
        return;
      }
      this.renderTitle(account.data.name);
    });

    Transaction.list(options, (error, response) => {
      if (error || !response.data) {
        return;
      }
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
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const today = new Date(date);

    const day = today.getDate();
    const month = today.toLocaleString("ru-RU", { month: "long" });
    const year = today.getFullYear();
    const hours = today.getHours().toString().padStart(2, "0");
    const minutes = today.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(
            item.created_at
          )}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
         ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.querySelector(".content");
    if (!content) return;

    content.innerHTML =
      data.length === 0
        ? "<p>Нет транзакций</p>"
        : data.map((item) => this.getTransactionHTML(item)).join("");
  }
}
