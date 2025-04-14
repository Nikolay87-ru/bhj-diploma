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
    this.element.addEventListener("click", (event) => {
      const removeAccountBtn = event.target.closest(".remove-account");
      const removeTransactionBtn = event.target.closest(".transaction__remove");

      if (removeAccountBtn) {
        event.preventDefault();
        this.removeAccount();
      }

      if (removeTransactionBtn) {
        event.preventDefault();
        const transactionId = removeTransactionBtn.dataset.id;
        const transactionElement = removeTransactionBtn.closest(".transaction");
        const transactionName = transactionElement.querySelector(
          ".transaction__title"
        ).textContent;

        this.removeTransaction(transactionId, { name: transactionName });
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
    Object.values(App.modals).forEach((modal) => {
      if (
        !["confirmAccount", "confirmTransaction"].includes(modal.element.id)
      ) {
        modal.close();
      }
    });

    const activeAccount = document.querySelector(".account.active");
    if (!activeAccount) {
      this.showMessage("Выберите счёт для удаления!", "error");
      return;
    }

    const accountName = activeAccount.querySelector("span").textContent;
    const modal = App.getModal("confirmAccount");

    modal.setContent({
      title: `Удаление счета`,
      content: `Вы действительно хотите удалить счёт "${accountName}"?`,
      confirmText: "Удалить",
    });

    modal.onConfirm = () => {
      Account.remove({ id: activeAccount.dataset.id }, (error, response) => {
        if (error || !response?.success) {
          return;
        }

        const accounts = document.querySelectorAll(".account");
        if (accounts.length > 0) {
          accounts[0].classList.add("active");
          this.render({ account_id: accounts[0].dataset.id });
        } else {
          this.clear();
        }

        App.updateWidgets();
        App.updateForms();
      });
    };

    modal.open();
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id, data) {
    Object.values(App.modals).forEach((modal) => {
      if (
        !["confirmAccount", "confirmTransaction"].includes(modal.element.id)
      ) {
        modal.close();
      }
    });
    const modal = App.getModal("confirmTransaction");

    modal.setContent({
      title: "Удаление транзакции",
      content: `Вы действительно хотите удалить транзакцию "${data.name}"?`,
      confirmText: "Удалить",
    });

    modal.onConfirm = () => {
      Transaction.remove({ id }, (error, response) => {
        if (error || !response?.success) {
          return;
        }

        if (this.lastOptions) {
          this.render(this.lastOptions);
        }
        App.update();
      });
    };

    modal.open();
  }

  showMessage(text, type = "info") {
    const message = document.createElement("div");
    message.className = `user-message message-${type}`;
    message.innerHTML = `<span class="message__text">${text}</span>`;

    const existingMessage = this.element.querySelector(".user-message");
    if (existingMessage) existingMessage.remove();

    this.element.querySelector("h1").after(message);

    setTimeout(() => message.remove(), 3000);
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
        this.showMessage("Ошибка загрузки счета", "error");
        return;
      }
      this.renderTitle(account.data.name);
    });

    Transaction.list(options, (error, response) => {
      if (error) {
        this.showMessage("Ошибка загрузки транзакций", "error");
        return;
      }
      this.renderTransactions(response?.data || []);
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
