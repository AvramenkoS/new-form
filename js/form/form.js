class DependenciesInjection {
  addedCss() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./js/form/css/form.css";
    document.head.appendChild(link);
  }
  addedJs() {
    const link = document.createElement("script");
    link.src = "./js/form/js/intlTelInput.js";
    document.head.appendChild(link);
  }

  addForm() {
    const link = document.createElement("script");
    link.src = "./js/form/js/form.js";
    link.type = "module";
    document.body.appendChild(link);
  }
  async init() {
    await this.addedCss();
    await this.addedJs();
    await this.addForm();
  }
}

new DependenciesInjection().init();
