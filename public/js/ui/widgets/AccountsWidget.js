/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    this.element = element;
    this.registerEvents();
    this.update();
    this.registerRemoveAccountEvent();

    if (!element) {
      throw new Error("Не передан элемент формы");
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener("click", (e) => {
      e.preventDefault();

      const createAccount = e.target.closest(".create-account");
      const accountItem = e.target.closest(".account");

      if (createAccount) {
        App.getModal("createAccount").open();
        return;
      }

      if (accountItem) {
        this.onSelectAccount(accountItem);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    console.log("Текущий пользователь:", currentUser);

    if (!currentUser) return;

    Account.list(currentUser, (err, response) => {
      console.log("Ответ сервера:", response);
      if (err || !response || !response.data) return;

      this.clear();
      this.renderItem(response.data);
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll(".account");
    accounts.forEach((account) => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const accounts = this.element.querySelectorAll(".account");
    accounts.forEach((account) => account.classList.remove("active"));

    element.classList.add("active");
    App.showPage("transactions", { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `
      <li class="account" data-id="${item.id}">
        <a href="#">
          <span>${item.name}</span>
          <span>${item.sum} ₽</span>
        </a>
      </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const accountsList = this.element;

    if (!accountsList) {
      return;
    }

    const header = accountsList.querySelector(".header");
    accountsList.innerHTML = "";
    if (header) {
      accountsList.append(header);
    }

    data.forEach((item) => {
      accountsList.insertAdjacentHTML("beforeend", this.getAccountHTML(item));
    });
  }

  registerRemoveAccountEvent() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".remove-account")) {
        event.preventDefault();
        this.removeAccount();
      }
    });
  }

  removeAccount() {
    const activeAccount = this.element.querySelector(".account.active");

    if (!activeAccount) {
      return;
    }

    Account.remove({ id: accountId }, (error, response) => {
      if (error || !response.success) {
        return;
      }

      activeAccount.remove();

      const accounts = this.element.querySelectorAll(".account");
      if (accounts.length > 0) {
        accounts[0].classList.add("active");
        App.showPage("transactions", { account_id: accounts[0].dataset.id });
      } else {
        App.showPage("transactions", { account_id: null });
      }

      App.update();
    });
  }
}
