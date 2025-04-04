class AsyncForm {
  constructor(element) {
    this.element = element;
    this.registerEvents();

    if (!element) {
      throw new Error("Не передан элемент формы");
    }
  }

  registerEvents() {
    this.element.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  getData() {
    const formData = new FormData(this.element);
    const entries = formData.entries();
    const data = {};

    for (let [name, value] of entries) {
      data[name] = value;
    }

    return data;
  }

  onSubmit(data) {}

  submit() {
    const formData = this.getData();
    this.onSubmit(formData);
  }
}
