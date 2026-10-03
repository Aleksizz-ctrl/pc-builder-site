'use strict';

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

// A local demonstration only: no request is sent and no personal data is stored.
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const message = form.elements.message;
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Please enter at least 10 characters, excluding surrounding spaces.');
    if (!form.reportValidity()) return;
    status.textContent = 'Your request passes validation. Demo only: nothing has been sent or saved. You can edit the form and check it again.';
    status.hidden = false;
});

form.addEventListener('input', (event) => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    status.hidden = true;
});
