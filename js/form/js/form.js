import variables from "./variables.js";
import regExp from "./reg.js";
import form from "./formMarkup.js";
import localization from "./localization.js";

class FormMarkup {
    constructor() {
        this.formRef = document.querySelectorAll(".form-container");
    }

    insertFormInDOM() {
        this.formRef.forEach((el) => {
            el.insertAdjacentHTML("afterbegin", form);
        });
    }

    async start() {
        await this.insertFormInDOM();
    }
}

class LocalizationAndRefsToInput {
    constructor() {
        this.formLang =
            localization[variables.lang.toUpperCase()] || localization["EN"];
        this.inputFirstName = document.querySelectorAll('input[name="firstname"]');
        this.inputLastName = document.querySelectorAll('input[name="lastname"]');
        this.inputEmail = document.querySelectorAll('input[name="email"]');
        this.btnSubmit = document.querySelectorAll(".send-form");
        this.formTitle = document.querySelectorAll('h2[name="title"]');
    }

    insertLocalization(element) {
        element.forEach((el) => {
            if (el.name === "button") {
                el.innerHTML = this.formLang[el.name];
            }
            if (el.nodeName === "H2") {
                el.innerHTML = this.formLang.title;
            }
            el.placeholder = this.formLang[el.name];
        });
    }

    async start() {
        await this.insertLocalization(this.formTitle);
        await this.insertLocalization(this.inputFirstName);
        await this.insertLocalization(this.inputLastName);
        await this.insertLocalization(this.inputEmail);
        await this.insertLocalization(this.btnSubmit);
    }
}

class Validation {
    constructor() {
        this.inputFirstName = document.querySelectorAll('input[name="firstname"]');
        this.inputLastName = document.querySelectorAll('input[name="lastname"]');
        this.inputEmail = document.querySelectorAll('input[name="email"]');
        this.inputsPhone = document.querySelectorAll(".phone");
        this.btnSubmit = document.querySelectorAll(".send-form");
        this.phoneHidden = document.querySelectorAll("input[name=full-phone]");
        this.prefixCountry = document.querySelectorAll("input[name=prefix]");
        this.checkName = false;
        this.checkLastName = false;
        this.checkEmail = false;
        this.checkPhone = false;
        this.rv_fullName = regExp.name;
        this.rv_email = regExp.email;
        this.iti = this.getIntlInputData();
    }

    isValidInput(element) {
        element.classList.add("valid");
        element.classList.remove("invalid");
    }

    isInvalidInput(element) {
        element.classList.add("invalid");
        element.classList.remove("valid");
    }

    getIntlInputData() {
        return window.intlTelInput(this.inputsPhone);
    }

    validatesInputsHandler(inputs, reg) {
        inputs.forEach((el) => {
            el.addEventListener("input", ({target}) => {
                if (target.value.trim() !== "" && reg.test(target.value)) {
                    this.isValidInput(el);
                    return this.checkAllFields(el);
                }
                this.isInvalidInput(el);
                return this.checkAllFields(el);
            });
        });
    }

    validatesNumberInputsHandler() {
        this.inputsPhone.forEach((el, ind) => {
            el.addEventListener("input", () => {
                if (this.iti[ind].isValidNumber()) {
                    this.setPhoneDataFromIntlInput(this.iti[ind]);
                    this.isValidInput(el);
                    return this.checkAllFields(el);
                }
                this.isInvalidInput(el);
                return this.checkAllFields(el);
            });
        });
    }

    checkAllFields(element) {
        const bool = element.classList.contains("valid");
        if (element.name === "firstname") {
            this.checkName = bool;
        }
        if (element.name === "lastname") {
            this.checkLastName = bool;
        }
        if (element.name === "email") {
            this.checkEmail = bool;
        }
        if (element.name === "phone") {
            this.checkPhone = bool;
        }
        this.makeBtnActive();
    }

    makeBtnActive() {
        const cheked =
            this.checkName &&
            this.checkLastName &&
            this.checkEmail &&
            this.checkPhone;

        if (cheked) {
            this.btnSubmit.forEach((el) => {
                el.removeAttribute("disabled");
            });
        }
        if (!cheked) {
            this.btnSubmit.forEach((el) => {
                el.setAttribute("disabled", "");
            });
        }
    }

    setPhoneDataFromIntlInput(intlPhoneInstance) {
        let getNum = intlPhoneInstance.getNumber();
        let numPrefix = intlPhoneInstance.getSelectedCountryData().dialCode;
        this.phoneHidden.forEach((item) => item.setAttribute("value", getNum));
        this.prefixCountry.forEach((item) => item.setAttribute("value", numPrefix));
    }

    start() {
        this.validatesInputsHandler(this.inputFirstName, this.rv_fullName);
        this.validatesInputsHandler(this.inputLastName, this.rv_fullName);
        this.validatesInputsHandler(this.inputEmail, this.rv_email);
        this.validatesNumberInputsHandler();
    }
}

class ParsedUrlAndSetVariables {
    constructor(defaultVariable) {
        this.queryParams = new URLSearchParams(window.location.search);
        this.params = [
            {domain: window.location.hostname},
            {offer: defaultVariable.offer},
            {lang: defaultVariable.lang},
            {clickid: this.getSubId("_subid") || null},
            ...this.parsedVariables(defaultVariable),
        ];
    }

    parsedVariables(data) {
        const arr = [];
        for (let [key, value] of Object.entries(data)) {
            const searchInUrl = this.queryParams.get(key) || value || "";
            arr.push({[key]: searchInUrl});
        }
        return arr;
    }

    setParamsInInput() {
        this.params.forEach((el) => {
            const key = Object.keys(el)[0];
            const value = Object.values(el)[0];
            this.setValue(key, value);
        });
    }

    setSessionStorage() {
        let pixel = this.params.find(element => element.px).px
        window.sessionStorage.setItem('px', pixel)
    }

    setValue(key, value = "") {
        document
            .querySelectorAll(`input[name=${key}]`)
            .forEach((el) => el.setAttribute("value", value));
    }

    getSubId = (name) => {
        let cookieValue;
        if (document.cookie && document.cookie !== "") {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    };

    start() {
        this.setParamsInInput();
        this.setSessionStorage();
    }
}

class SendDataToBD {
    constructor() {
        this.formRef = document.querySelector(".form-container");
        this.URL = "https://create-traffic.com/api/new-form.php";
    }

    async sendData(e) {
        e.preventDefault();
        const data = Array.from(new FormData(this.formRef), (e) =>
            e.map(encodeURIComponent).join("=")
        ).join("&");
        console.log(data)
        try {
            const response = await fetch(this.URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            });
            const resp = await response.json();
            if (resp.status.result === 'success') {
                window.location.href = `success.php?px=${window.sessionStorage.getItem('px')}&link=${resp.status.link}`
            } else {
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    formHandler() {
        this.formRef.addEventListener("submit", this.sendData.bind(this));
    }
}

new FormMarkup().start();
new LocalizationAndRefsToInput().start();
new ParsedUrlAndSetVariables(variables).start();
new Validation().start();
new SendDataToBD().formHandler();

// ?aff_id=DEV3&aff_id2=DEV3_H&aff_c=CREO&sub_id_3=test&sub_id_4=test&sub_id_5=test&sub_id_6=test&sub_id_7=test&sub_id_8=test&sub_id_9=test
