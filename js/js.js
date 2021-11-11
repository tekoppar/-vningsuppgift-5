const messageType = {
    error: "errorMessages",
    missingValue: "missingValue",
    tooShort: "tooShort",
}

const registerFormMessages = {
    email: "email",
    password: "password",
    confirmpassword: "password",
    forename: "forename",
    surname: "surname",
}

const messages = {
    errorMessages: {
        email: "I am expecting an e-mail address!",
        password: "Your password most contain at least one special character, one number, one upper case and one lower case character.",
        forename: "Invalid forename, please fill it in.",
        surname: "Invalid surname, please fill it in.",
    },
    missingValue: {
        email: "I am missing an e-mail address!",
        password: "You forgot to fill in your password.",
        forename: "Missing forename, please fill it in.",
        surname: "Missing surname, please fill it in.",
    },
    tooShort: {
        email: "You're email is too short!",
        password: "You need a longer password, please try again.",
        forename: "That name is too short.",
        surname: "That surname is too short.",
    }
}

function getMessage(type, value) {
    return messages[type][value];
}

function validateInputs(el) {
    let errorMessage = "";

    if (el.validity.typeMismatch || el.validity.patternMismatch) {
        errorMessage = getMessage(messageType.error, el.name);

        el.setCustomValidity(errorMessage);
        el.parentNode.dataset.error = errorMessage;
        el.parentNode.classList.add("arrow-top");
    } else if (el.validity.tooShort) {
        errorMessage = getMessage(messageType.tooShort, el.name);

        el.setCustomValidity(errorMessage);
        el.parentNode.dataset.error = errorMessage;
        el.parentNode.classList.add("arrow-top");
    } else if (el.validity.valueMissing) {
        errorMessage = getMessage(messageType.missingValue, el.name);

        el.setCustomValidity(errorMessage);
        el.parentNode.dataset.error = errorMessage;
        el.parentNode.classList.add("arrow-top");
    } else {
        el.setCustomValidity("");
        el.parentNode.classList.remove("arrow-top");
    }
}

function removeTooltips() {
    let tooltipMessageEl = document.querySelector(".arrow-top");

    if (tooltipMessageEl) {
        tooltipMessageEl.classList.remove("arrow-top");
    }
}

window.onclick = removeTooltips;