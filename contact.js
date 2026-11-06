'use strict';

(() => {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const status = document.querySelector('#form-status');
    const counter = document.querySelector('#message-count');
    const touched = new Set();

    // Each validator returns a specific error, or an empty string for valid input.
    function validateName(value) {
        const name = value.trim();
        if (!name) return 'Please enter your name.';
        if (Array.from(name).length < 2) return 'Use at least 2 characters for your name.';
        if (name.length > 100) return 'Use no more than 100 characters for your name.';
        if (!/^[\p{L}\p{M} '\u2019-]+$/u.test(name) || !/\p{L}/u.test(name)) {
            return 'Use only letters, spaces, hyphens and apostrophes.';
        }
        return '';
    }

    function validateEmail(value) {
        const email = value.trim();
        if (!email) return 'Please enter your email address.';
        const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
        const localPart = email.split('@')[0];
        if (email.length > 254 || !emailPattern.test(email) || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
            return 'Enter a valid email address, such as you@example.com.';
        }
        return '';
    }

    function validateConfirmEmail(value) {
        if (!value.trim()) return 'Please confirm your email address.';
        if (value.trim() !== form.elements.email.value.trim()) return 'Email addresses must match.';
        return '';
    }

    function validateRequestType(value) {
        return value ? '' : 'Please choose a request type.';
    }

    function validateMessage(value) {
        if (value.trim().length < 10) return 'Enter at least 10 characters, excluding surrounding spaces.';
        if (value.length > 2000) return 'Use no more than 2,000 characters.';
        return '';
    }

    const fields = [
        { field: form.elements.name, validate: validateName },
        { field: form.elements.email, validate: validateEmail },
        { field: form.elements.confirmEmail, validate: validateConfirmEmail },
        { field: form.elements.requestType, validate: validateRequestType },
        { field: form.elements.message, validate: validateMessage }
    ];

    function showError(field, error) {
        document.querySelector(`#${field.id}-error`).textContent = error;
        field.classList.toggle('is-invalid', Boolean(error));
        field.classList.toggle('is-valid', !error);
        field.setAttribute('aria-invalid', String(Boolean(error)));
    }

    function validateField(entry) {
        const error = entry.validate(entry.field.value);
        showError(entry.field, error);
        touched.add(entry.field);
        return error;
    }

    function updateCounter() {
        const length = form.elements.message.value.length;
        counter.textContent = `${length.toLocaleString('en-US')} / 2,000 characters`;
        counter.classList.toggle('is-over-limit', length > 2000);
    }

    function clearFeedback() {
        touched.clear();
        fields.forEach(({ field }) => {
            document.querySelector(`#${field.id}-error`).textContent = '';
            field.classList.remove('is-valid', 'is-invalid');
            field.removeAttribute('aria-invalid');
        });
        status.hidden = true;
        status.textContent = '';
        status.classList.remove('is-success');
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        status.hidden = true;
        let firstInvalid = null;
        fields.forEach((entry) => {
            if (validateField(entry) && !firstInvalid) firstInvalid = entry.field;
        });
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        const name = form.elements.name.value.trim();
        form.reset();
        updateCounter();
        // textContent keeps the user's name as text, rather than executable HTML.
        status.textContent = `Thank you, ${name}! Your request passed validation. This student demo does not send or save messages.`;
        status.classList.add('is-success');
        status.hidden = false;
    });

    form.addEventListener('focusout', (event) => {
        const entry = fields.find(({ field }) => field === event.target);
        if (entry) validateField(entry);
    });

    form.addEventListener('input', (event) => {
        status.hidden = true;
        const entry = fields.find(({ field }) => field === event.target);
        if (entry && touched.has(entry.field)) validateField(entry);
        // An edited original email can invalidate an already confirmed address.
        const confirm = fields[2];
        if (event.target === form.elements.email && touched.has(confirm.field)) validateField(confirm);
        if (event.target === form.elements.message) updateCounter();
    });

    form.addEventListener('reset', () => {
        clearFeedback();
        // The reset event fires before the browser clears the field values.
        counter.textContent = '0 / 2,000 characters';
        counter.classList.remove('is-over-limit');
    });

    updateCounter();
})();
