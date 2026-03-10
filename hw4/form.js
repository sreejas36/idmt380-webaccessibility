    // --------------------
    // Form Validation
    // --------------------
    const form = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const firstnameInput = document.getElementById('firstname');
    const firstnameError = document.getElementById('firstname-error');
    const lastnameInput = document.getElementById('lastname');
    const lastnameError = document.getElementById('lastname-error');
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    const discardBtn = document.getElementById('discard-btn');

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(input, errorElement, message) {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
    }

    function showFieldValid(input, errorElement) {
        input.removeAttribute('aria-invalid');
        errorElement.textContent = '';
    }

    function setupFieldValidation(input, errorElement, fieldName, validator = null) {
        if (!input) return;

        const getErrorMessage = (isEmpty) => {
            if (isEmpty) return `${fieldName} is required!`;
            if (fieldName === 'Email') return 'Please enter a valid email address';
            if (fieldName === 'First Name') return 'Hey, who are you?';
            return null;
        };

        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (!value) showFieldError(input, errorElement, getErrorMessage(true));
            else if (validator && !validator(value)) showFieldError(input, errorElement, getErrorMessage(false));
            else showFieldValid(input, errorElement);
        });

        input.addEventListener('input', () => {
            if (input.hasAttribute('aria-invalid')) {
                const value = input.value.trim();
                if (!value) return;
                if (validator && !validator(value)) return;
                showFieldValid(input, errorElement);
            }
        });
    }

    setupFieldValidation(firstnameInput, firstnameError, 'First Name');
    setupFieldValidation(lastnameInput, lastnameError, 'Last Name');
    setupFieldValidation(emailInput, emailError, 'Email', validateEmail);
    setupFieldValidation(messageInput, messageError, 'Message');

// --------------------
// Form Submission
// --------------------
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;
    let firstErrorField = null;

    [[firstnameInput, firstnameError, 'First Name'],
    [lastnameInput, lastnameError, 'Last Name'],
    [emailInput, emailError, 'Email'],
    [messageInput, messageError, 'Message']].forEach(([input, errorElement, name]) => {
        const value = input.value.trim();

        if (!value) {
            showFieldError(input, errorElement, `${name} is required`);
            if (!firstErrorField) firstErrorField = input;
            hasError = true;
        } else if (name === 'Email' && !validateEmail(value)) {
            showFieldError(input, errorElement, 'Please enter a valid email address ');
            if (!firstErrorField) firstErrorField = input;
            hasError = true;
        } else {
            showFieldValid(input, errorElement);
        }
    });

    if (hasError) {
        if (formFeedback) {
            formFeedback.textContent = 'Please fix the errors in the form before submitting.';
        }

        if (firstErrorField) firstErrorField.focus();
        return;
    }

    // Store form data
    const formData = {
        firstname: firstnameInput.value.trim(),
        lastname: lastnameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
    };

    localStorage.setItem('formSubmission', JSON.stringify(formData));

    if (formFeedback) {
    formFeedback.textContent = 'Your message was successfully submitted! Thank you for reaching out.';
    }


// clear the form after successful submission
form.reset();

// remove validation states
[firstnameInput, lastnameInput, emailInput, messageInput].forEach(input => {
    input.removeAttribute('aria-invalid');
});

// clear error messages
[firstnameError, lastnameError, emailError, messageError].forEach(error => {
    error.textContent = '';
});
});

    // --------------------
    // Discard / Reset
    // --------------------
    if (discardBtn) {
        discardBtn.addEventListener('click', () => {
            form.reset();
            [firstnameInput, lastnameInput, emailInput, messageInput].forEach(input => input.removeAttribute('aria-invalid'));
            [firstnameError, lastnameError, emailError, messageError].forEach(error => error.textContent = '');
            if (formFeedback) {
                formFeedback.textContent = 'Form discarded!';
                setTimeout(() => formFeedback.textContent = '', 3000);
            }
        });
    }