'use strict';

const THEME_KEY = 'pc-builder-theme';

function loadTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || 'dark';
    } catch (error) {
        return 'dark';
    }
}

function applyTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    const button = document.querySelector('#theme-toggle');
    if (button) {
        button.textContent = theme === 'light' ? 'Dark theme' : 'Light theme';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(loadTheme());

    const button = document.querySelector('#theme-toggle');
    if (!button) return;

    button.addEventListener('click', () => {
        const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch (error) {
            applyTheme(next);
            return;
        }
        applyTheme(next);
    });
});