// Form Validation

let submitForm = false;
let attempts = 0;
let maxAttempts = 3;

function showError(text) {
    let message = document.getElementById("message");
    message.innerHTML = text;
    message.style.color = "red";
    return false;
}

function showSuccess(text) {
    let message = document.getElementById("message");
    message.innerHTML = text;
    message.style.color = "green";
    return submitForm;
}

function wrongPassword(reason) {
    attempts++;
    let message = document.getElementById("message");

    if (attempts >= maxAttempts) {
        document.getElementById("submitBtn").disabled = true;
        message.innerHTML = reason + "<br>Too many wrong attempts! Locked for 10 seconds.";
        setTimeout(unlockForm, 10000);
    } else {
        let left = maxAttempts - attempts;
        message.innerHTML = reason + "<br>Attempts left: " + left;
    }

    message.style.color = "red";
    return false;
}

function unlockForm() {
    attempts = 0;
    document.getElementById("submitBtn").disabled = false;
    document.getElementById("message").innerHTML = "You can try again now.";
    document.getElementById("message").style.color = "green";
}


function validateRegister() {
    let fullname = document.getElementById("fullname").value.trim();
    let officerId = document.getElementById("officerid").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let male = document.getElementById("male").checked;
    let female = document.getElementById("female").checked;
    let department = document.getElementById("department").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let idcard = document.getElementById("idcard").value;
    let terms = document.getElementById("terms").checked;

    let specialChar = /[!@#$%^&*]/;
    let phonePattern = /^01[0-9]{9}$/;

    if (fullname === "") {
        return showError("Full name is required.");
    }
    if (fullname.length < 2) {
        return showError("Full name needs at least 2 characters.");
    }

    if (officerId === "") {
        return showError("Officer ID is required.");
    }

    if (email === "") {
        return showError("Official email is required.");
    }
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        return showError("Enter a valid email address.");
    }

    if (phone === "") {
        return showError("Phone number is required.");
    }
    if (!phonePattern.test(phone)) {
        return showError("Phone must be 11 digits and start with 01.");
    }

    if (dob === "") {
        return showError("Please select your date of birth.");
    }

    if (!male && !female) {
        return showError("Please select your gender.");
    }

    if (department === "") {
        return showError("Please select a department.");
    }

    if (password.length < 5) {
        return wrongPassword("Password needs at least 5 characters.");
    }
    if (password === password.toLowerCase()) {
        return wrongPassword("Password needs an uppercase letter.");
    }
    if (!specialChar.test(password)) {
        return wrongPassword("Password needs at least one special character.");
    }
    if (password !== confirm) {
        return wrongPassword("Password and confirm password must match.");
    }

    if (idcard === "") {
        return showError("Please upload your office ID card.");
    }

    if (!terms) {
        return showError("You must confirm the information and agree to the terms.");
    }

    attempts = 0;
    console.log("Registration validated for " + fullname);
    return showSuccess("Validation passed!");
}


function validateSearch() {
    let keyword = document.getElementById("keyword").value.trim();

    if (keyword !== "" && keyword.length < 2) {
        return showError("Keyword needs at least 2 characters.");
    }

    return showSuccess("Search is ready!");
}


function validateDecision() {
    let decision = document.getElementById("decision").value;
    let remarks = document.getElementById("remarks").value.trim();

    if (decision === "reject" || decision === "info") {
        if (remarks === "") {
            return showError("Remarks are required when you reject a report or ask for more information.");
        }
        if (remarks.length < 5) {
            return showError("Remarks need at least 5 characters.");
        }
    }

    return showSuccess("Ready to submit!");
}


function validateAssign() {
    let worker = document.getElementById("worker").value;
    let dueDate = document.getElementById("duedate").value;

    if (worker === "") {
        return showError("Please select a field worker.");
    }
    if (dueDate === "") {
        return showError("Please select a due date.");
    }

    return showSuccess("Worker assignment is ready!");
}


function validateVerify() {
    let reject = document.getElementById("reject").checked;
    let remarks = document.getElementById("remarks").value.trim();
    let checked = document.getElementById("checked").checked;

    if (!checked) {
        return showError("Please confirm that you have checked the photos and the work.");
    }

    if (reject && remarks === "") {
        return showError("Remarks required");
    }

    return showSuccess("Ready to submit!");
}


function validateFilter() {
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;

    if (from !== "" && to !== "" && from > to) {
        return showError("From date cannot be after the To date.");
    }

    return showSuccess("Filter is ready!");
}
